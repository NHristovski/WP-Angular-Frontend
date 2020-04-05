## Семинарска по предметот веб програмирање на факултетот ФИНКИ. 

### Никола Христовски 161101
 
### Опис на темата

Е-продавница каде корисници можат да купат разни ставки.

* Корисниците можат да се регистрираат и да се најават во системот
* Корисниците можат да ги филтрираат ставките по категорија или по популарност
* Корицниците можат да дадат оценка за одредена ставка
* Корисниците можат да додадат ставки во кошничка
* Корисниците можат да ја видат својата кошничка и да манипулираат со количината на ставките
* Корисниците можат да ги купат ставките во кошничката
* Корисниците можат да ги прегледаат сите ставки што некогаш ги купиле

<hr>

* Админ корисниците можат да додаваат категории
* Админ корисниците можат да додаваат ставки
* Админ корисниците можат да ги пребаруваат и уредуваат ставките       

<br>

### Составни делови на проектот

- Front End
  - [Angular Frontend](https://github.com/NHristovski/WP-Angular-Frontend "Angular Frontend")
- Back End
  - [Eureka Service Registry](https://github.com/NHristovski/WP-Project-ServiceRegistry "Eureka Service Registry")
  - [Zuul API Gateway](https://github.com/NHristovski/WP-Project-API_Gateway "Zuul API Gateway")
  - [Authentication Service](https://github.com/NHristovski/WP-Project-AuthService "Authentication Service")
  - [Users Service](https://github.com/NHristovski/WP-Project-Users "Users Service")
  - [Product Service](https://github.com/NHristovski/WP-Project-Products "Product Service")
  
<hr>

<br>

### Упатство за стартување на back-end и front-end апликациите.

-  Стартување на back-end апликациите
    - Клонирајте го [Eureka Service Registry](https://github.com/NHristovski/WP-Project-ServiceRegistry "Eureka Service Registry") проектот
      - Стартувајте го проектот со "dev" активен профил на Spring конфигурација
    - Клонирајте го [Zuul API Gateway](https://github.com/NHristovski/WP-Project-API_Gateway "Zuul API Gateway") проектот
      - Стартувајте го проектот со "dev" активен профил на Spring конфигурација
    - Клонирајте го [Authentication Service](https://github.com/NHristovski/WP-Project-AuthService "Authentication Service") проектот
      - Стартувајте го проектот со "dev" активен профил на Spring конфигурација
    - Клонирајте го [Users Service](https://github.com/NHristovski/WP-Project-Users "Users Service") проектот
      - Стартувајте го проектот со "dev" активен профил на Spring конфигурација 
    - Клонирајте го [Product Service](https://github.com/NHristovski/WP-Project-Products "Product Service") проектот
      - Стартувајте го проектот со "dev" активен профил на Spring конфигурација
    - Одете на [http://localhost:8761/](http://localhost:8761/ "http://localhost:8761/")
      - Почекајте да се појават четирите проекти во делот "Instances currently registered with Eureka"
      - Стартувајте ја front-end апликацијата со упатството подоле
      
    - *** Алтернативен начин на стартување на back-end апликациите со Docker ***
      - Клонирајте го [Product Service](https://github.com/NHristovski/WP-Project-Products "Product Service") проектот
      - Влезете во фолдерот и извршете `docker-compose up -d`
      - Одете на [http://localhost:8761/](http://localhost:8761/ "http://localhost:8761/")
        - Почекајте да се појават четирите проекти во делот "Instances currently registered with Eureka"
        - Стартувајте ја front-end апликацијата со упатството подоле

-  Стартување на front-end апликацијата
    - Клонирајте го проектот од [Github](https://github.com/NHristovski/WP-Angular-Frontend "Angular Frontend")
    - Извршете: `npm install`
    - Извршете: `ng serve`
    - Одете на: [http://localhost:4200/](http://localhost:4200/ "http://localhost:4200/")
    - Најавете се со Админ корисникот: `username: "admin" , password: "admin"` 
    
    
