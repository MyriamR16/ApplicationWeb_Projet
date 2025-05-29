package n7.back_project_appli_web;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;

import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import n7.back_project_appli_web.configuration.JwtUtils;
import n7.back_project_appli_web.PersonneRepository;
import n7.back_project_appli_web.Personne;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {
    private final PersonneRepository personneRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils; 
    private final AuthenticationManager authenticationManager; 

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Personne personne){
        if (personneRepository.findByPseudo(personne.getPseudo()) != null){
            return ResponseEntity.badRequest().body("Ce pseudo est déjà connecté");
        }

        personne.setMotDePasse(passwordEncoder.encode(personne.getMotDePasse()));
        return ResponseEntity.ok(personneRepository.save(personne));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Personne personne){
        try{
            Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(personne.getPseudo(), personne.getMotDePasse()));
            if (authentication.isAuthenticated()){
                Map<String, Object> authData = new HashMap<>();
                authData.put("token", jwtUtils.generateToken(personne.getPseudo()));
                authData.put("type", "Bearer");
                return ResponseEntity.ok(authData);
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Pseudo ou Mot de Passe invalide");
        } catch (AuthenticationException e){
            log.error(e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Pseudo ou Mot de Passe invalide");
        }
    }
}
