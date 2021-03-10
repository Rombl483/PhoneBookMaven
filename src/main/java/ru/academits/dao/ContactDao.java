package ru.academits.dao;

import ru.academits.model.Contact;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

/**
 * Created by Anna on 17.06.2017.
 */
public class ContactDao {
    private List<Contact> contactList = new ArrayList<>();
    private AtomicInteger idSequence = new AtomicInteger(0);

    public ContactDao() {
        Contact contact = new Contact();
        contact.setId(getNewId());
        contact.setFirstName("Иван");
        contact.setLastName("Иванов");
        contact.setPhone("9123456789");
        contactList.add(contact);
    }

    private int getNewId() {
        return idSequence.addAndGet(1);
    }

    public List<Contact> getAllContacts() {
        return contactList;
    }

    public List<Contact> getFilteredContacts(String contactFilter) {
        return contactList.stream().filter(contact ->
                contact.getPhone().contains(contactFilter) ||
                        contact.getFirstName().contains(contactFilter) ||
                        contact.getLastName().contains(contactFilter)
        ).collect(Collectors.toList());
    }

    public void add(Contact contact) {
        contact.setId(getNewId());
        contactList.add(contact);
    }

    public boolean remove(Contact contact) {
        for (Contact contactItem : contactList) {
            if (contactItem.getLastName().equals(contact.getLastName()) &&
                    contactItem.getFirstName().equals(contact.getFirstName()) &&
                    contactItem.getPhone().equals(contact.getPhone())) {
                return contactList.remove(contactItem);
            }
        }

        return false;
    }
}
