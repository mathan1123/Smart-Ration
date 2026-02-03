package com.ration.backend.controller;

import com.ration.backend.model.RationCard;
import com.ration.backend.repository.RationCardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ration-cards")
public class RationCardController {

    @Autowired
    private RationCardRepository rationCardRepository;

    @GetMapping
    public java.util.List<RationCard> getAllCards() {
        return rationCardRepository.findAll();
    }

    @PostMapping
    public RationCard saveCard(@RequestBody RationCard card) {
        return rationCardRepository.save(card);
    }

    @GetMapping("/{cardNumber}")
    public ResponseEntity<RationCard> getCardByNumber(@PathVariable String cardNumber) {
        return rationCardRepository.findByCardNumber(cardNumber)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<RationCard> updateCard(@PathVariable Long id, @RequestBody RationCard details) {
        return rationCardRepository.findById(id)
                .map(card -> {
                    card.setCardNumber(details.getCardNumber());
                    card.setHolderName(details.getHolderName());
                    card.setFamilyMembers(details.getFamilyMembers());
                    card.setCardType(details.getCardType());
                    return ResponseEntity.ok(rationCardRepository.save(card));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCard(@PathVariable Long id) {
        return rationCardRepository.findById(id)
                .map(card -> {
                    rationCardRepository.delete(card);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
