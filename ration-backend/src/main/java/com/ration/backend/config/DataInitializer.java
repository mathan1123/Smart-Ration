package com.ration.backend.config;

import com.ration.backend.model.Entitlement;
import com.ration.backend.model.Item;
import com.ration.backend.model.RationCard;
import com.ration.backend.repository.EntitlementRepository;
import com.ration.backend.repository.ItemRepository;
import com.ration.backend.repository.RationCardRepository;
import com.ration.backend.repository.ShopStatusRepository;
import com.ration.backend.model.ShopStatus;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(
            RationCardRepository cardRepo,
            ItemRepository itemRepo,
            EntitlementRepository entitlementRepo,
            ShopStatusRepository shopStatusRepo) {
        return args -> {
            // Create Ration Items
            Item rice = itemRepo.save(new Item(null, "Rice", "kg", 3.0, 500.0));
            Item wheat = itemRepo.save(new Item(null, "Wheat", "kg", 2.0, 300.0));
            Item sugar = itemRepo.save(new Item(null, "Sugar", "kg", 20.0, 100.0));
            Item kerosene = itemRepo.save(new Item(null, "Kerosene", "L", 15.0, 200.0));
            Item dal = itemRepo.save(new Item(null, "Dal", "kg", 60.0, 200.0));

            // 1. PHH Card (Standard)
            RationCard card1 = cardRepo.save(new RationCard(null, "100000000001", "Anita Raj", 4, "PHH"));
            entitlementRepo.save(new Entitlement(null, card1, rice, 20.0, 0.0));
            entitlementRepo.save(new Entitlement(null, card1, wheat, 10.0, 0.0));
            entitlementRepo.save(new Entitlement(null, card1, sugar, 2.0, 0.0));

            // 2. AAY Card (High Subsidy)
            RationCard card2 = cardRepo.save(new RationCard(null, "100000000002", "Sunita Devi", 2, "AAY"));
            entitlementRepo.save(new Entitlement(null, card2, rice, 35.0, 5.0));
            entitlementRepo.save(new Entitlement(null, card2, wheat, 0.0, 0.0));
            entitlementRepo.save(new Entitlement(null, card2, sugar, 3.0, 0.0));
            entitlementRepo.save(new Entitlement(null, card2, kerosene, 5.0, 0.0));

            // 3. NPHH Card (General)
            RationCard card3 = cardRepo.save(new RationCard(null, "100000000003", "Rahul Verma", 3, "NPHH"));
            entitlementRepo.save(new Entitlement(null, card3, rice, 10.0, 2.0));
            entitlementRepo.save(new Entitlement(null, card3, wheat, 5.0, 5.0)); // Fully used

            // 4. Large Family (PHH)
            RationCard card4 = cardRepo.save(new RationCard(null, "100000000004", "Mohd. Ibrahim", 6, "PHH"));
            entitlementRepo.save(new Entitlement(null, card4, rice, 30.0, 10.0));
            entitlementRepo.save(new Entitlement(null, card4, wheat, 15.0, 0.0));
            entitlementRepo.save(new Entitlement(null, card4, dal, 2.0, 0.0));

            // 5. Single Member (AAY)
            RationCard card5 = cardRepo.save(new RationCard(null, "100000000005", "David John", 1, "AAY"));
            entitlementRepo.save(new Entitlement(null, card5, rice, 15.0, 14.0)); // Almost finished
            entitlementRepo.save(new Entitlement(null, card5, kerosene, 2.0, 0.0));

            // Initialize Shop Status
            if (shopStatusRepo.count() == 0) {
                shopStatusRepo.save(new ShopStatus(true, "Monday - Saturday", "9:00 AM - 6:00 PM"));
            }

            System.out.println("Backend: Database initialized with 5 sample cards.");
        };
    }
}
