package com.ration.backend.controller;

import com.ration.backend.model.*;
import com.ration.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private RationCardRepository rationCardRepository;

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private EntitlementRepository entitlementRepository;

    @GetMapping
    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    @PostMapping

    @Transactional
    public ResponseEntity<Transaction> createTransaction(@RequestBody TransactionRequest request) {
        RationCard card = rationCardRepository.findByCardNumber(request.cardNumber)
                .orElseThrow(() -> new RuntimeException("Card not found"));

        Transaction transaction = new Transaction();
        transaction.setRationCard(card);
        transaction.setTransactionDate(LocalDateTime.now());
        transaction.setTotalAmount(request.totalAmount);

        List<TransactionItem> items = new ArrayList<>();
        for (TransactionItemRequest itemRequest : request.items) {
            Item item = itemRepository.findByName(itemRequest.itemName)
                    .orElseThrow(() -> new RuntimeException("Item not found: " + itemRequest.itemName));

            TransactionItem transactionItem = new TransactionItem();
            transactionItem.setTransaction(transaction);
            transactionItem.setItem(item);
            transactionItem.setQuantity(itemRequest.quantity);
            transactionItem.setAmount(itemRequest.amount);
            items.add(transactionItem);

            // Update Entitlement
            List<Entitlement> entitlements = entitlementRepository.findByRationCard(card);
            for (Entitlement e : entitlements) {
                if (e.getItem().getId().equals(item.getId())) {
                    e.setUsedQuantity(e.getUsedQuantity() + itemRequest.quantity);
                    entitlementRepository.save(e);
                }
            }
        }

        transaction.setItems(items);
        return ResponseEntity.ok(transactionRepository.save(transaction));
    }

    public static class TransactionRequest {
        public String cardNumber;
        public Double totalAmount;
        public List<TransactionItemRequest> items;
    }

    public static class TransactionItemRequest {
        public String itemName;
        public Double quantity;
        public Double amount;
    }
}
