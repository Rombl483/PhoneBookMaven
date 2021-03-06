function Contact(firstName, lastName, phone) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.phone = phone;
    this.checked = false;
    this.shown = true;
}

new Vue({
    el: "#app",
    data: {
        validation: false,
        serverValidation: false,
        firstName: "",
        lastName: "",
        phone: "",
        rows: [],
        serverError: "",
        contactFilter: ""
    },
    methods: {
        contactToString: function (contact) {
            var note = "(";
            note += contact.firstName + ", ";
            note += contact.lastName + ", ";
            note += contact.phone;
            note += ")";
            return note;
        },
        convertContactList: function (contactListFromServer) {
            return contactListFromServer.map(function (contact, i) {
                return {
                    id: contact.id,
                    firstName: contact.firstName,
                    lastName: contact.lastName,
                    phone: contact.phone,
                    checked: false,
                    shown: true,
                    number: i + 1
                };
            });
        },
        addContact: function () {
            if (this.hasError) {
                this.validation = true;
                this.serverValidation = false;
                return;
            }

            var self = this;

            var contact = new Contact(this.firstName, this.lastName, this.phone);
            $.ajax({
                type: "POST",
                url: "/phonebook/add",
                data: JSON.stringify(contact)
            }).done(function () {
                self.serverValidation = false;
            }).fail(function (ajaxRequest) {
                var contactValidation = JSON.parse(ajaxRequest.responseText);
                self.serverError = contactValidation.error;
                self.serverValidation = true;
            }).always(function () {
                self.loadData();
            });

            self.firstName = "";
            self.lastName = "";
            self.phone = "";
            self.validation = false;
        },
        removeContact: function (id) {
            var self = this;

            var contact = new Contact(this.rows[id].firstName, this.rows[id].lastName, this.rows[id].phone);

            $.ajax({
                type: "POST",
                url: "/phonebook/remove",
                data: JSON.stringify(contact)
            }).always(function () {
                self.loadFilteredData();
            });
        },
        removeSelectedContact: function () {
            var self = this;

            var selectedContacts = this.rows.filter(function (row) {
                return row.checked;
            }).map(function (row) {
                return new Contact(row.firstName, row.lastName, row.phone);
            });

            $.ajax({
                type: "POST",
                url: "/phonebook/remove/selected",
                data: JSON.stringify(selectedContacts)
            }).always(function () {
                self.loadFilteredData();
            });
        },
        loadFilteredData: function () {
            var self = this;
            $.ajax({
                type: "GET",
                url: "/phonebook/get?contactFilter=" + self.contactFilter
            }).done(function (response) {
                var contactListFormServer = JSON.parse(response);
                self.rows = self.convertContactList(contactListFormServer);
            });
        },
        resetFilter: function () {
            var self = this;
            self.contactFilter = "";
            self.loadData();
        },
        loadData: function () {
            var self = this;

            $.get("/phonebook/get/all").done(function (response) {
                var contactListFormServer = JSON.parse(response);
                self.rows = self.convertContactList(contactListFormServer);
            });
        }
    },
    computed: {
        firstNameError: function () {
            if (this.firstName) {
                return {
                    message: "",
                    error: false
                };
            }

            return {
                message: "???????? ?????? ???????????? ???????? ??????????????????.",
                error: true
            };
        },
        lastNameError: function () {
            if (!this.lastName) {
                return {
                    message: "???????? ?????????????? ???????????? ???????? ??????????????????.",
                    error: true
                };
            }

            return {
                message: "",
                error: false
            };
        },
        phoneError: function () {
            if (!this.phone) {
                return {
                    message: "???????? ?????????????? ???????????? ???????? ??????????????????.",
                    error: true
                };
            }

            var self = this;

            var sameContact = this.rows.some(function (c) {
                return c.phone === self.phone;
            });

            if (sameContact) {
                return {
                    message: "?????????? ???????????????? ???? ???????????? ?????????????????????? ???????????? ???????????? ?? ???????????????????? ??????????.",
                    error: true
                };
            }

            return {
                message: "",
                error: false
            };
        },
        hasError: function () {
            return this.lastNameError.error || this.firstNameError.error || this.phoneError.error;
        }
    },
    created: function () {
        this.loadData();
    }
});

