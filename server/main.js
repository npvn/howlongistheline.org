import { Meteor } from 'meteor/meteor';
import { Locations } from '/imports/api/lines.js';
import Feedbacks from '/imports/api/feedback'
import moment from 'moment';

Meteor.startup(() => {
  SyncedCron.add({
  name: 'Reset status to No Line if it has not been updated for a while',
  schedule: function(parser) {
    // parser is a later.parse object
    return parser.text('every 81 minutes');
  },
  job: function() {
    updateStatus();
  }
});
SyncedCron.start();
});
function updateStatus() {
    var now = moment();
    var locations = Locations.find({}, { sort: { createdAt: -1 } }).fetch();
    for (var i in locations) {
      var diff = now.diff(locations[i].lastUpdate, 'minutes')
      if (diff >= 60) {
        Locations.upsert(locations[i]._id, {
          $set: {
              lastUpdate: new Date(),
              status: "no"
            }
        })
      }
    }
}
