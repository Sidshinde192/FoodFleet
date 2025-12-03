package in.Sidshinde.foddiesapi.contoller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import in.Sidshinde.foddiesapi.io.FoodResponse;
import in.Sidshinde.foddiesapi.io.foodRequest;
import in.Sidshinde.foddiesapi.service.FoodService;
import lombok.AllArgsConstructor;


@RestController
@RequestMapping("/api/foods")
@AllArgsConstructor
@CrossOrigin("*")
public class foodController {

    private final FoodService foodService;
    
    @PostMapping
    public FoodResponse addFodd(@RequestPart("food") String foodString, @RequestPart("file") MultipartFile file) throws com.fasterxml.jackson.core.JsonProcessingException{
            ObjectMapper objectMapper = new ObjectMapper();
            foodRequest request = null;
            try{
              request = objectMapper.readValue(foodString, foodRequest.class);
            }
            catch(JsonProcessingException ex){
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid JSON format");

            }  
            
            FoodResponse response = foodService.addFood(request, file);
            return response;
    }
    

    @GetMapping
    public List<FoodResponse> readFoods() {
        return foodService.readFoods();
    }

    @GetMapping("/{id}")
    public FoodResponse readFood(@PathVariable String id) {
        return foodService.readFood(id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteFood(@PathVariable String id) {
        foodService.deleteFood(id);
    }


    




    

}
