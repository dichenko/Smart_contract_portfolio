
## Staking (Farming)
Write a staking smart contract, create a liquidity pool on uniswap on the testnet. The staking contract accepts LP tokens, after a certain time (for example 10 minutes) to the user rewards are awarded in the form of reward tokens written in the first week. The number of tokens depends on the amount staked LP tokens (for example, 20 percent). It is also possible to withdraw staked LP tokens after a certain time (eg 20 minutes).

- Create a liquidity pool
- Implement staking functionality in a smart contract
- Write full-fledged tests for the contract
- Write deployment script
- Deploy to the test network
- Write tasks for stake, unstake, claim
- Verify the contract

#Requirements

- The stake(uint256 amount) function - charges the user for the LP staking contract tokens in the amount of the amount, updates the user's balance in the contract
- The claim() function - withdraws reward tokens available as rewards from the staking contract
- The unstake() function - writes off tokens available for withdrawal from the LP staking contract
- Admin functions to change staking parameters (freeze time, percentage)



### Задание

## Стейкинг

Написать смарт-контракт стейкинга, создать пул ликвидности на uniswap в тестовой сети. Контракт стейкинга принимает ЛП токены, после определенного времени (например 10 минут) пользователю начисляются награды в виде ревард токенов написанных на первой неделе. Количество токенов зависит от суммы застейканных ЛП токенов (например 20 процентов). Вывести застейканные ЛП токены также можно после определенного времени (например 20 минут).

- Создать пул ликвидности
- Реализовать функционал стейкинга в смарт контракте
- Написать полноценные тесты к контракту
- Написать скрипт деплоя
- Задеплоить в тестовую сеть
- Написать таски на stake, unstake, claim
- Верифицировать контракт

# Требования
- Функция stake(uint256 amount) - списывает с пользователя на контракт стейкинга ЛП токены в количестве amount, обновляет в контракте баланс пользователя
- Функция claim() - списывает с контракта стейкинга ревард токены доступные в качестве наград
- Функция unstake() - списывает с контракта стейкинга ЛП токены доступные для вывода
- Функции админа для изменения параметров стейкинга (время заморозки, процент)

### Deploy
Contract deployed and verifyed [on Rinkeby network](https://rinkeby.etherscan.io/address/0xDcE00efBf1df478792643Afdc1f823c61B097af7#code)
