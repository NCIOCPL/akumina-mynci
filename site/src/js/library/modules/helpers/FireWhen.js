export function FireWhen(id, condition, callback, testInterval) {
    if (condition == null) {
      return;
    }
    var conditionMet = condition();
    if (conditionMet) {
      clearTimeout(window[id]);
      Akumina.AddIn.Logger.WriteInfoLog('FireWhen:conditionMet:' + id);
      callback.apply(this, Array.prototype.slice.call(arguments, 4));
    } else {
      clearTimeout(window[id]);
      window[id] = window.setTimeout(
        function (args) {
          FireWhen.apply(this, args);
        },
        testInterval,
        arguments
      );
    }
  };