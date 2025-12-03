package in.Sidshinde.foddiesapi.service;

import in.Sidshinde.foddiesapi.entity.ContactEntity;
import in.Sidshinde.foddiesapi.io.ContactRequest;
import in.Sidshinde.foddiesapi.io.ContactResponse;
import in.Sidshinde.foddiesapi.repository.ContactRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@AllArgsConstructor
public class ContactServiceImpl implements ContactService {
    private final ContactRepository contactRepository;

    @Override
    public ContactResponse submitContact(ContactRequest request) {
        ContactEntity contactEntity = convertToEntity(request);
        contactEntity = contactRepository.save(contactEntity);
        return convertToResponse(contactEntity);
    }

    private ContactEntity convertToEntity(ContactRequest request) {
        return ContactEntity.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .message(request.getMessage())
                .createdAt(LocalDateTime.now())
                .build();
    }

    private ContactResponse convertToResponse(ContactEntity contactEntity) {
        return ContactResponse.builder()
                .id(contactEntity.getId())
                .firstName(contactEntity.getFirstName())
                .lastName(contactEntity.getLastName())
                .email(contactEntity.getEmail())
                .message(contactEntity.getMessage())
                .createdAt(contactEntity.getCreatedAt())
                .build();
    }
}


