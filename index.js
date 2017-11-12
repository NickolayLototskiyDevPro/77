const ProjectModule = (function () {
    let instance;
    return {
        getInstance: function () {
            if (!instance) {
                instance = project;
            }
            return instance;
        }
    }
})();

const project = {
    participants: [],
    pricing: {},
    isBusy: boolean = false,

    /* implement initialization of the object */
    /* participants - predefined array of participants */
    /* pricing - predefined object (keyvalue collection) of pricing */
    init(participants, pricing) {
        if (participants == undefined || pricing == undefined)
            return false;
        this.participants = participants;
        this.pricing = pricing;
    },

    /* pass found participant into callback, stops on first match */
    /* functor - function that will be executed for elements of participants array */
    /* callbackFunction - function that will be executed with found participant as argument or with null if not */
    /* callbackFunction (participant) => {} */
    findParticipant(functor, callbackFunction) {
        if (this.isBusy) {
            return false;
        }
        this.isBusy = true;

        this.participants.forEach((participant, index) => {
            if (functor(participant)) {
                setTimeout(() => {
                    project.isBusy = false;
                    callbackFunction(participant);
                });
            } else {
                setTimeout(() => {
                    project.isBusy = false;
                    callbackFunction(null);
                });
            }
        });
    },

    /* pass array of found participants into callback */
    /* functor - function that will be executed for elements of participants array */
    /* callbackFunction - function that will be executed with array of found participants as argument or empty array if not */
    /* callbackFunction (participantsArray) => {} */
    findParticipants(functor, callbackFunction) {
        if (this.isBusy)
            return false;
        this.isBusy = true;

        let participantsM = [];
        this.participants.forEach((participant) => {
            if (functor(participant)) {
                participantsM.push(participant);
            }
        });
        setTimeout(() => {
            this.isBusy = false;
            callbackFunction(participantsM);
        });
    },

    /* push new participant into this.participants array */
    /* callbackFunction - function that will be executed when job will be done */
    /* (err) => {} */
    addParticipant(participantObject, callbackFunction) {
        if (this.isBusy)
            return false;

        this.isBusy = true;
        if ('seniorityLevel' in participantObject) {
            this.participants.push(participantObject);
            setTimeout(() => {
                this.isBusy = false;
                callbackFunction();
            });
        } else {
            setTimeout(() => {
                this.isBusy = false;
                callbackFunction('error');
            });
        }
    },

    /* push new participant into this.participants array */
    /* callback should receive removed participant */
    /* callbackFunction - function that will be executed with object of removed participant or null if participant wasn't found when job will be done */
    removeParticipant(participantObject, callbackFunction) {
        if (this.isBusy)
            return false;
        this.isBusy = true;

        let tempForRemove;
        for (var i = 0; i < this.participants.length; i++) {
            if (this.participants[i] === participantObject) {
                tempForRemove = i;
            }
        }
        if (tempForRemove !== undefined) {
            let removed = this.participants.splice(tempForRemove, 1);
            setTimeout(() => {
                this.isBusy = false;
                callbackFunction(removed[0]);
            });
        } else {
            setTimeout(() => {
                this.isBusy = false;
                callbackFunction(null);
            });
        }
    },


    /* Extends this.pricing with new field or change existing */
    /* callbackFunction - function that will be executed when job will be done, doesn't take any arguments */
    setPricing(participantPriceObject, callbackFunction) {
        if (this.isBusy)
            return false;
        this.isBusy = true;

        Object.assign(this.pricing, participantPriceObject);
        setTimeout(() => {
            this.isBusy = false;
            callbackFunction();
        });
    },
    /* calculates salary of all participants in the given period */
    /* periodInDays, has type number, one day is equal 8 working hours */
    calculateSalary(periodInDays) {
        const hoursPerDay = 8;
        let result = 0;
        this.participants.forEach((participant) => {
            if (!Object.keys(this.pricing).includes(participant.seniorityLevel)) {
                throw new Error("error");
            }
            for (let priceK in this.pricing) {
                if (participant.seniorityLevel === priceK) {
                    result += this.pricing[priceK] * hoursPerDay * periodInDays;
                }
            }
        });
        return result;
    }
}

module.exports = {
    firstName: 'Vitalii',
    lastName: 'Drygailo',
    task: ProjectModule.getInstance()
}

