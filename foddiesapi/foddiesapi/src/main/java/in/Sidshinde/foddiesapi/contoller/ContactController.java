package in.Sidshinde.foddiesapi.contoller;

import in.Sidshinde.foddiesapi.io.ContactRequest;
import in.Sidshinde.foddiesapi.io.ContactResponse;
import in.Sidshinde.foddiesapi.service.ContactService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact")
@AllArgsConstructor
@CrossOrigin("*")
public class ContactController {
    private final ContactService contactService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ContactResponse submitContact(@RequestBody ContactRequest request) {
        return contactService.submitContact(request);
    }
}


