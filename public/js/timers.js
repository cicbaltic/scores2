// Client side RefreshTimer constructor.
//
// setTimer(action: () => void, intervalMilliseconds: number): void;
// - Sets window timer to run specified or default action periodically at specified or default interval.
//   Start is delayed by hardcoded small time amount.
//   Timer is settable only once. Behavior after subsequent attempts to set timer is not defined.
//
// - clearTimer(): void;
//   Clears timer, i.e., ceases to run timer actions.

var RefreshTimer = (function () {

    function RefreshTimer() {
        if (!(this instanceof RefreshTimer)) {
            return new RefreshTimer();
        }
    }

    RefreshTimer.prototype.DELAY_MILLISECONDS = 1000;
    RefreshTimer.DEFAULT_INTERVAL_MILLISECONDS = 1000;
    RefreshTimer.DEFAULT_ACTION = function () {
        try {
            window.document.body.click();
        } catch (e) {
        }
    };

    RefreshTimer.prototype.setTimer = function (action, intervalMilliseconds) {
        var self = this;
        intervalMilliseconds = intervalMilliseconds || RefreshTimer.DEFAULT_INTERVAL_MILLISECONDS;
        if (action === void 0) {
            action = RefreshTimer.DEFAULT_ACTION;
        }

        var delayTimerId = window.setTimeout(function () {
            if (self.timerId) {
                // Timer is settable only once.
            } else {
                self.timerId = window.setInterval(action, intervalMilliseconds);
            }
            if (delayTimerId) {
                window.clearTimeout(delayTimerId);
            }
        }, RefreshTimer.prototype.DELAY_MILLISECONDS);
    };

    RefreshTimer.prototype.clearTimer = function () {
        if (this.timerId) {
            window.clearInterval(this.timerId)
            this.timerId = (void 0);
        }
    };

    return RefreshTimer;
})();
