const Model = require("../Model/transactionSchema");
const axios = require("axios");

const initDatabase = async (req, res) => {
    try {
        const response = await axios.get("https://s3.amazonaws.com/roxiler.com/product_transaction.json");
        const seedData = response.data;
        console.log(seedData)

        // CLEAR DATA FROM DATABASE 

        await Model.deleteMany({});

        // INSERT DATA IN DATABASE 

        await Model.insertMany(seedData);

        res.status(200).send(seedData)
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ msg: "Database Initialize Failed" })
    }
};


// Month  DATA 


const monthData = async (req, res) => {

    const { dateOfSale } = req.params;
    const startDate = `${dateOfSale}-01T00:00:00`;
    const endDate = new Date(new Date(startDate).setMonth(new Date(startDate).getMonth() + 1)).toISOString();
    try {
        const salesData = await Model.find({
            dateOfSale: {
                $gte: new Date(startDate),
                $lt: new Date(endDate)
            }
        });
        res.json(salesData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}





const pagination = async (req, res) => {
    const { page = 1, perPage = 10, search } = req.query;
    const skip = (page - 1) * perPage;
    const query = {};

    if (search) {
        query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { price: { $regex: search, $options: 'i' } },
        ];
    }

    try {
        const transactions = await Model.find(query)
            .skip(skip)
            .limit(parseInt(perPage));
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}



const statisticsData = async (req, res) => {
    const { dateOfSale } = req.params;
    const startDate = `${dateOfSale}-01T00:00:00`;
    const endDate = new Date(new Date(startDate).setMonth(new Date(startDate).getMonth() + 1)).toISOString();
    try {
        const totalSaleAmount = await Model.aggregate([
            {
                $match: {
                    dateOfSale: {
                        $gte: startDate,
                        $lte: endDate
                    },
                    sold: true
                }
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: '$amount' }
                }
            }
        ]);

        const totalSoldItems = await Model.countDocuments({
            dateOfSale: {
                $gte: startDate,
                $lte: endDate
            },
            sold: true
        });

        const totalNotSoldItems = await Model.countDocuments({
            dateOfSale: {
                $gte: startDate,
                $lte: endDate
            },
            sold: false
        });

        res.json({
            totalSaleAmount: totalSaleAmount.length > 0 ? totalSaleAmount[0].totalAmount : 0,
            totalSoldItems,
            totalNotSoldItems
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = { initDatabase, monthData, statisticsData, pagination };

