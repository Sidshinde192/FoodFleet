package in.Sidshinde.foddiesapi.service;

import in.Sidshinde.foddiesapi.io.ContactRequest;
import in.Sidshinde.foddiesapi.io.ContactResponse;

public interface ContactService {
    ContactResponse submitContact(ContactRequest request);
}


