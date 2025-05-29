package n7.back_project_appli_web.service;

import java.util.Collections;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import n7.back_project_appli_web.Personne;
import n7.back_project_appli_web.PersonneRepository;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
    private final PersonneRepository personneRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Personne personne = personneRepository.findByPseudo(username);

        if (personne == null) {
            throw new UsernameNotFoundException("L'utilisateur n'a pas été trouvé avec le pseudo : " + username);
        }
        return new User(personne.getPseudo(), personne.getMotDePasse(),
                Collections.singletonList(new SimpleGrantedAuthority(personne.getRole())));
    }

}
