const Event = require("../model/Event");

module.exports.entryEventData_get = (req, res) => {
  Event.find({ flagship: false })
    .limit(3)
    .then((result) => {
      res.status(200).json(
        result.map((element) => {
          return {
            uniqueName: element["uniqueName"],
            eventName: element["eventName"],
            eventAbstract: element["eventAbstract"],
          };
        })
      );
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ msg: "Error" });
    });
};

module.exports.alleventData_get = (req, res) => {
  Event.find({})
    .then((result) => {
      res.status(200).json(
        result.map((element) => {
          return {
            uniqueName: element["uniqueName"],
            eventName: element["eventName"],
            eventAbstract: element["eventAbstract"],
          };
        })
      );
    })
    .catch((err) => {
      res.status(400).json({ msg: "Error" });
    });
};

module.exports.singleEvent_post = (req, res) => {
  const { uniqueName } = req.body;
  Event.findOne({ uniqueName: uniqueName })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(400).json({ msg: "NotFound" });
    });
};

module.exports.getFlagShipEvents_get = (req, res) => {
  Event.find({ flagship: true })
    .then((result) => {
      res
        .status(200)
        .json(
          result.map((element) => {
            return {
              uniqueName: element["uniqueName"],
              eventName: element["eventName"],
              eventAbstract: element["eventAbstract"],
            };
          })
        );
    })
    .catch((err) => {
      res.status(400).json({ msg: "Error" });
    });
};
