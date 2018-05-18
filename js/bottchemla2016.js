function make_slides(f) {

  var slides = {};



  slides.i0 = slide({
    name: "i0",
    start: function() {
      exp.startT = Date.now();
    }
  });

  slides.consent = slide({
    name: "consent",
    start: function() {
      exp.startT = Date.now();
      $("#consent_2").hide();
      exp.consent_position = 0;
    },
    button: function() {
      if (exp.consent_position == 0) {
        exp.consent_position++;
        $("#consent_1").hide();
        $("#consent_2").show();
      } else {
        exp.go(); //use exp.go() if and only if there is no "present" data.
      }
    }
  });



  /*Consult the code in the consent slide if you
    want to break down very long instructions */
  slides.instructions = slide({
    name: "instructions",
    button: function() {
      exp.go(); //use exp.go() if and only if there is no "present" data.
    }
  });



  slides.example = slide({
    name: "example",
    start: function() {},

    present: exampleList,

    present_handle: function(stim) {

      this.stim = stim

      $(".err").hide();
      $('input[name=exampleChoice]:checked').prop('checked', false);
      $("#exampleCondition").html(exampleSentence(this.stim["example"], this.stim["exampleSymbols"]));

      specifyExampleCards(this.stim); // use trial dictionary build cards.

      document.getElementById("exampleChoiceL").accessKey = ",";
      document.getElementById("exampleChoiceR").accessKey = ".";
      document.getElementById("continueButton").accessKey = "/";

      slide.condition = 0;
    },


    cardButton: function() { // if a card is selected
      $('.err').hide(); // hide error
      slide.condition = 1; // note that something is selected
    },


    button: function() {
      if (slide.condition == 1) {
        if (this.stim["example"] == $('input[name=exampleChoice]:checked').val()) { // make sure correct response on examples
          document.getElementById("exampleChoiceL").accessKey = null; // disable quick keys after trials are over
          document.getElementById("exampleChoiceR").accessKey = null;
          document.getElementById("continueButton").accessKey = null;
          this.log_responses(); // log responses
          _stream.apply(this); // store data}
        } else {
          $("#exampleErr").html("Are you sure? Please consider which card best matches the sentence and and try again.")
          $('.err').show();
        }
      } else {
        $("#exampleErr").html("Please select one of the options.")
        $('.err').show();
      }
    },


    log_responses: function() {

      exp.data_trials.push({ // data to be stored
        "trial_type": "example",
      });
    },
  });



  slides.trial = slide({ // the main slide

    name: "trial",
    start: function() {},


    present: trialList, //trialOrder,

    //this gets run only at the beginning of the block, which means for each 'present' thing.
    present_handle: function(stim) {
      this.stim = stim; //

      specifyTrialCards(this.stim); // use trial dictionary build cards.

      // Uncheck card buttons and erase the previous values
      exp.criticalResponse = null;
      exp.primeOneChoice = null;
      exp.primeTwoChoice = null;
      exp.responseChoice = null;
      $('input[name=primeOneChoice]:checked').prop('checked', false);
      $('input[name=primeTwoChoice]:checked').prop('checked', false);
      $('input[name=responseChoice]:checked').prop('checked', false);
      slide.condition = 0; // no card has been selected


      // hide everything but for the primeOne cards
      $(".err").hide();
      $(".responseContainerL").hide();
      $(".responseContainerR").hide();
      document.getElementById("responseChoiceL").accessKey = null;
      document.getElementById("responseChoiceR").accessKey = null;
      $(".primeTwoContainerL").hide();
      $(".primeTwoContainerR").hide();
      $(".primeOneContainerL").show();
      $(".primeOneContainerR").show();
      document.getElementById("primeOneChoiceL").accessKey = ",";
      document.getElementById("primeOneChoiceR").accessKey = ".";
      document.getElementById("continueButton").accessKey = "/";

      // show primeOne stimulus
      $("#trialCondition").html(conditionSentence(this.stim["prime"], this.stim["primeOneSymbols"]));

      this.stim = stim; // I like to store this information in the slide so I can record it later.
    },

    cardButton: function() { // if a card is selected
      $('.err').hide(); // hide error
      slide.condition = 1; // note that something is selected
    },

    /*
      The button function does a lot.
      Primarily, it updates the slide to follow the trial.
      We do this by first showing relevant info for the first prime, and then if a selection has
      been made we update to the second, and then to the response, when we store information and then
      move to the next trial.
      The function does this by checking in reverse, as response takes precedence over primeTwo, etc…
    */

    button: function() { // what to do when the lower button is clicked
      if (slide.condition == 1) { // so long as a button is clicked, we update…
        $(".err").hide(); // hide error
        exp.responseChoice = $('input[name=responseChoice]:checked').val(); // now update one button values
        exp.primeOneChoice = $('input[name=primeOneChoice]:checked').val();
        exp.primeTwoChoice = $('input[name=primeTwoChoice]:checked').val();
        if (exp.responseChoice != null) { // if one has chosen the response
          this.log_responses(); // log responses
          _stream.apply(this); // store data
        } else if (exp.primeTwoChoice != null) { // if one has chosen the second prime…
          $("#trialCondition").html(conditionSentence(this.stim["response"], this.stim["responseSymbols"]));
          $(".primeTwoContainerL").hide();
          $(".primeTwoContainerR").hide();
          document.getElementById("primeTwoChoiceL").accessKey = null;
          document.getElementById("primeTwoChoiceR").accessKey = null;
          $(".responseContainerL").show();
          $(".responseContainerR").show();
          document.getElementById("responseChoiceL").accessKey = ",";
          document.getElementById("responseChoiceR").accessKey = ".";
          slide.condition = 0;
        } else if (exp.primeOneChoice != null) { // if one has chosen the first prime…
          $("#trialCondition").html(conditionSentence(this.stim["prime"], this.stim["primeTwoSymbols"]));
          $(".primeOneContainerL").hide();
          $(".primeOneContainerR").hide();
          document.getElementById("primeOneChoiceL").accessKey = null;
          document.getElementById("primeOneChoiceR").accessKey = null;
          $(".primeTwoContainerL").show();
          $(".primeTwoContainerR").show();
          document.getElementById("primeTwoChoiceL").accessKey = ",";
          document.getElementById("primeTwoChoiceR").accessKey = ".";
          slide.condition = 0;
        }
      } else { // otherwise…
        $('.err').show() // show error
      }
    },

    log_responses: function() {
      exp.data_trials.push({ // data to be stored
        "trial_type": "response",
        "trial_data": this.stim, // store all trial data, as who knows…
        "primeOneChoice": exp.primeOneChoice,
        "goodPrimeOneChoice": this.stim["goodPrimeOneChoice"],
        "correctPrimeOneChoice": (exp.primeOneChoice == this.stim["goodPrimeOneChoice"]),
        "primeTwoChoice": exp.primeTwoChoice,
        "goodPrimeTwoChoice": this.stim["goodPrimeTwoChoice"],
        "correctPrimeTwoChoice": (exp.primeTwoChoice == this.stim["goodPrimeTwoChoice"]),
        "correctPrimeChoices": (exp.primeOneChoice == exp.primeTwoChoice == this.stim["goodPrimeTwoChoice"]),
        "responseChoice": exp.responseChoice, // rename response
        // could include time of response as well
      });
      document.getElementById("responseChoiceL").accessKey = null; // disable quick keys after trials are over
      document.getElementById("responseChoiceR").accessKey = null;
      document.getElementById("continueButton").accessKey = null;
      /* console logs for testing */
      console.log('this trial…')
      console.log(this.stim)
      console.log('prime test')
      console.log(exp.primeOneChoice == this.stim["goodPrimeOneChoice"] && exp.primeTwoChoice == this.stim["goodPrimeTwoChoice"])
      console.log(exp.data_trials) // show the data, for testing
    }
  });



  slides.subj_info = slide({
    name: "subj_info",
    submit: function(e) {
      exp.subj_data = {
        language: $("#language").val(),
        enjoyment: $("#enjoyment").val(),
        asses: $('input[name="assess"]:checked').val(),
        age: $("#age").val(),
        gender: $("#gender").val(),
        education: $("#education").val(),
        comments: $("#comments").val(),
        problems: $("#problems").val(),
        fairprice: $("#fairprice").val()
      };
      exp.go(); //use exp.go() if and only if there is no "present" data.
    }
  });



  slides.thanks = slide({
    name: "thanks",
    start: function() {
      exp.data = {
        "trials": exp.data_trials,
        "catch_trials": exp.catch_trials,
        "system": exp.system,
        "condition": exp.condition,
        "subject_information": exp.subj_data,
        "time_in_minutes": (Date.now() - exp.startT) / 60000
      };
      setTimeout(function() {
        turk.submit(exp.data);
      }, 1000);
    }
  });

  return slides;
}



/// init ///
function init() {
  //blocks of the experiment:
  exp.structure = ["i0", "consent", "instructions", "example", "trial", "subj_info", "thanks"];

  // generally no need to change anything below
  exp.trials = [];
  exp.catch_trials = [];
  exp.data_trials = [];
  exp.system = {
    Browser: BrowserDetect.browser,
    OS: BrowserDetect.OS,
    screenH: screen.height,
    screenUH: exp.height,
    screenW: screen.width,
    screenUW: exp.width
  };

  //make corresponding slides:
  exp.slides = make_slides(exp);

  exp.nQs = utils.get_exp_length(); //this does not work if there are stacks of stims (but does work for an experiment with this structure)
  //relies on structure and slides being defined

  $('.slide').hide(); //hide everything

  //make sure turkers have accepted HIT (or you're not in mturk)
  $("#start_button").click(function() {
    if (turk.previewMode) {
      $("#mustaccept").show();
    } else {
      $("#start_button").click(function() {
        $("#mustaccept").show();
      });
      exp.go();
    }
  });

  exp.go(); //show first slide
}