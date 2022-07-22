### Задание:
- Написать контракт кроссчейн моста для отправки токенов стандарта ERC-20 между сетями Ethereum и Binance Smart chain.
- Написать контракт Bridge
- Написать полноценные тесты к контракту
- Написать скрипт деплоя
- Задеплоить в тестовую сеть
- Написать таск на swap, redeem
- Верифицировать контракт

## Требования  
- Функция swap(): списывает токены с пользователя и испускает event ‘swapInitialized’
- Функция redeem(): вызывает функцию ecrecover и восстанавливает по хэшированному сообщению и сигнатуре адрес валидатора, если адрес совпадает с адресом указанным на контракте моста то пользователю отправляются токены

## Ссылки 
ECDSA 
https://docs.openzeppelin.com/contracts/4.x/api/utils#ECDSA 

Signing Messages   
https://docs.ethers.io/v4/cookbook-signing.html?highlight=signmessage 

Mathematical and Cryptographic Functions
https://docs.soliditylang.org/en/v0.8.0/units-and-global-variables.html#mathematical-and-cryptographic-functions


## Deploy

[Contract deployed and verified in Rinkeby network](https://rinkeby.etherscan.io/address/0x4346672c50EF93108C95d10E4f2f4e0c7707cd6a#code)
