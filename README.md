## Create sub process to check if document csv has duplicated pokemons rows

- We are using roundRobin algorithm to get subprocess and delegate responsabilities to search duplicated elements
- Is an fact, if you need run something appear with this, using cluster 
- To make this, we're using child process library of nodejs core
- To each row of csv the main process choose the next child process to seek duplicated row in the file

## About project
```
├── package-lock.json
|── README.md
├── package.json
└── src
    ├── child-process.js => child processes to check duplicated elements
    └── index.js => main process
```

## Do you want run this project?

- First, you need make download of pokemons dataset https://www.kaggle.com/datasets/maca11/all-pokemon-dataset
- Add file inside data folder and rename to "pokemon.csv"
- To testing duplicated rows you need choice some rows to duplicate :)

- After all:
  ```bash
    npm ci #install dependencies by package-lock.json
    npm start # run script
  ```
