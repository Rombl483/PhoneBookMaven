package ru.academits.coverter;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import ru.academits.model.Contact;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class ContactConverter {
    private Gson gson = new GsonBuilder().create();

    public String convertToJson(List<Contact> contactList) {
        return gson.toJson(contactList);
    }

    public Contact convertFormJson(String contactJson) {
        return gson.fromJson(contactJson, Contact.class);
    }

    public List<Contact> convertListFormJson(String contactsJson) {
        Contact[] selectedContacts = gson.fromJson(contactsJson, Contact[].class);
        return new ArrayList<>(Arrays.asList(selectedContacts));
    }
}
