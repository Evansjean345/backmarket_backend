db.cars.aggregate([
    {
        $group: {
            _id: "$maker",
            TotalCars: {$sum: 1},
            TotalPrice: {$avg: "$price"},
            TotalServiceCost: {$avg: "$service_history.cost"},
        }
    },
])

db.cars.aggregate([
    {
        $match: {
            maker: "Honda",
            "engine.cc": {$gt: 1200},
        }
    },
    {
        $project: {
            maker: 1,
            model: 1,
            _id: 0
        }
    }
])