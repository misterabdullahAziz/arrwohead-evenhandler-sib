# Arrwohead-Eventhandler-SIB
This is implementation of Provider and Consumer of Arrowhead Framework, consuming EventHandler System. This system contains a Provider and Subscriber. Subscriber, subscribe an evnet in the eventhandler. Provider publish the event, which subscriber get notified by eventhandler.

### System Desgin
The system design is as follows.
![#1589F0](https://placehold.it/15/1589F0/000000?text=+) `AH Service Registry`
![#f03c15](https://placehold.it/15/f03c15/000000?text=+) `AH Authorization` 
![#c5f015](https://placehold.it/15/c5f015/000000?text=+) `AH Orchestrator`
![#ffcc44](https://placehold.it/15/ffcc44/000000?text=+) `AH Event Handler`
![Alt text](/documentation/images/overview.png)



### Running the project in development mode
1. The project requires [NodeJS](https://nodejs.org/en/download/)
2. Check your node version with the following command:
    ```
    node -v
    ```

3. Download or check out this project, go to the root folder and execute the following command, to install all dependencies
    ```
    npm install
    ```
4. Start the Provider by
    ```
    node Provider-Publisher.js
    ```
5. Start the Consumer by
    ```
    node Consumer-Subscriber.js
    ```
    
## Secure mode.
Currently this project is working in insecure mode. You can easily run this by changing few things as follows:

1. Run Arrohead core components in the secure mode.
2. Create certificates.
3. Use the `https` module instead of `http`.