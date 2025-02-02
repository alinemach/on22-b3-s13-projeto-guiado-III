const gamesModel = require("../models/gamesModel");
const consolesModel = require("../models/consolesModel");

const findAllGames = async (req, res) => {
    try {
        const allGames = await gamesModel.find().populate("console")
        res.status(200).json(allGames)
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

const findGameById = async (req, res) => {
    try {
        const findGames = await gamesModel.findById(req.params.id).populate("console")
        if (findGames == null)
            res.status(404).json({
                message: "Game not found"
            });
        res.status(200).json(findGames)
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

const addNewGame = async (req, res) => {
    try {
        const {
            consoleId,
            name,
            developer,
            releaseDate,
            genre,
            mode,
            available,
            description
        } = req.body

        if (!consoleId) { //só pode cadastrar em um console existente
            return res.status(400).json({
                message: "ConsoleId required"
            }) //400 = informacao requrida
        }

        const findConsole = await consolesModel.findById(consoleId)
        if (!findConsole) {
            return res.status(404).json({
                message: "Console not found"
            })
        }

        const newGame = new gamesModel({
            console: consoleId,
            name,
            developer,
            releaseDate,
            genre,
            mode,
            available,
            description
        })

        const savedGame = await newGame.save()
        res.status(200).json({
            message: "New game added successfully",
            savedGame
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: error.message
        })
    }
}

const updateGame = async (req, res) => {
    try {
        const {
            id
        } = req.params
        const {
            consoleId,
            name,
            developer,
            releaseDate,
            genre,
            mode,
            available,
            description
        } = req.body
        const findGame = await gamesModel.findById(id)
        if (findGame == null) {
            res.status(404).json({
                message: "Game not found"
            })
        }
        if (consoleId) {
            const findConsole = await consolesModel.findById(consoleId)
            if (findConsole = null) {
                return res.status(404).json({
                    message: "Console not found"
                })
            }
        }
        findGame.name = name || findGame.name;
        findGame.developer = developer || findGame.developer;
        findGame.releaseDate = releaseDate || findGame.releaseDate;
        findGame.genre = genre || findGame.genre;
        findGame.mode = mode || findGame.mode;
        findGame.available = available || findGame.available;
        findGame.description = description || findGame.description;
        findGame.console = consoleId || findGame.console;

        const savedGame = await findGame.save()
        res.status(200).json({
            message: "Game successfully updated",
            savedGame
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

const deleteGame = async (req, res) => {
    try {
        const {
            id
        } = req.params;
        const findGames = await gamesModel.findByIdAndDelete(id);

        if (findGames == null) {
            return res.status(404).json({
                message: `Game with id ${id} not found`
            })
        };

        res.status(200).json({
            message: `Game with id ${id} was successfully deleted`
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    };
};

//Atividade de casa

//Rota GET que encontre um jogo usando como parametro name (crie a logica na pasta controller);

const findGameByName = async (req, res) => {
    try {
        const {
            name
        } = req.query;
        const findGames = await gamesModel.find({
            name
        }).populate("console");

        if (findGames.length === 0) {
            return res.status(404).json({
                message: `Game with name ${name} not found`
            });
        }

        res.status(200).json(findGames);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

//rota GET para genre em jogos
const findGameByGenre = async (req, res) => {
    try {
        const {
            genre
        } = req.query;
        const findGames = await gamesModel.find({
            genre
        }).populate("console");

        if (findGames.length === 0) {
            return res.status(404).json({
                message: `Game with genre ${genre} not found!`
            })
        }

        res.status(200).json(findGames);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}


module.exports = {
    findAllGames,
    findGameById,
    addNewGame,
    updateGame,
    deleteGame,
    findGameByName,
    findGameByGenre
};