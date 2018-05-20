function make_slides(f) {

  var slides = {};



  slides.i0 = slide({
    name: "i0",
    start: function() {
      exp.startT = Date.now();
      addi0Keys();
    }
  });

  slides.consent = slide({
    name: "consent",
    start: function() {
      exp.startT = Date.now();
      $("#consent_2").hide();
      exp.consent_position = 0;

      cleari0Keys();
      addConsentKeys();
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
    start: function() {
      clearConsentKeys()
      addInstructionKeys();

    },
    button: function() {
      exp.go(); //use exp.go() if and only if there is no "present" data.
    }
  });


  slides.keyboard = slide({
    name: "keyboard",
    start: function() {
      clearInstructionKeys();
      addTestKeys();
    },
    button: function() {
      exp.go(); //use exp.go() if and only if there is no "present" data.
    }
  });



  slides.example = slide({
    name: "example",
    start: function() {

      clearTestKeys();
      addExampleKeys();
    },

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
    start: function() {

      clearExampleKeys();
    },


    present: trialList, //trialOrder,

    //this gets run only at the beginning of the block, which means for each 'present' thing.
    present_handle: function(stim) {

      this.trial_start = Date.now();
      this.stim = stim; //

      specifyTrialCards(this.stim); // use trial dictionary build cards.

      // Uncheck card buttons and erase the previous values
      this.stim.criticalResponse = null;
      this.stim.primeOneChoice = null;
      this.stim.primeTwoChoice = null;
      this.stim.responseChoice = null;
      $('input[name=primeOneChoice]:checked').prop('checked', false);
      $('input[name=primeTwoChoice]:checked').prop('checked', false);
      $('input[name=responseChoice]:checked').prop('checked', false);
      slide.condition = 0; // no card has been selected


      // hide everything but for the primeOne cards
      $(".err").hide();
      $(".responseContainerL").hide();
      $(".responseContainerR").hide();
      clearResponseKeys();
      $(".primeTwoContainerL").hide();
      $(".primeTwoContainerR").hide();
      $(".primeOneContainerL").show();
      $(".primeOneContainerR").show();
      addPrimeOneKeys();

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
        this.stim.responseChoice = $('input[name=responseChoice]:checked').val(); // now update one button values
        this.stim.primeOneChoice = $('input[name=primeOneChoice]:checked').val();
        this.stim.primeTwoChoice = $('input[name=primeTwoChoice]:checked').val();
        if (this.stim.responseChoice != null) { // if one has chosen the response
          this.log_responses(); // log responses
          _stream.apply(this); // store data
        } else if (this.stim.primeTwoChoice != null) { // if one has chosen the second prime…
          $("#trialCondition").html(conditionSentence(this.stim["response"], this.stim["responseSymbols"]));
          $(".primeTwoContainerL").hide();
          $(".primeTwoContainerR").hide();
          clearPrimeTwoKeys();
          $(".responseContainerL").show();
          $(".responseContainerR").show();
          addResponseKeys();
          slide.condition = 0;
        } else if (this.stim.primeOneChoice != null) { // if one has chosen the first prime…
          $("#trialCondition").html(conditionSentence(this.stim["prime"], this.stim["primeTwoSymbols"]));
          $(".primeOneContainerL").hide();
          $(".primeOneContainerR").hide();
          clearPrimeOneKeys();
          $(".primeTwoContainerL").show();
          $(".primeTwoContainerR").show();
          addPrimeTwoKeys();
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
        "primeOneChoice": this.stim.primeOneChoice,
        "goodPrimeOneChoice": this.stim["goodPrimeOneChoice"],
        "correctPrimeOneChoice": (this.stim.primeOneChoice == this.stim["goodPrimeOneChoice"]),
        "primeTwoChoice": this.stim.primeTwoChoice,
        "goodPrimeTwoChoice": this.stim["goodPrimeTwoChoice"],
        "correctPrimeTwoChoice": (this.stim.primeTwoChoice == this.stim["goodPrimeTwoChoice"]),
        "correctPrimeChoices": (this.stim.primeOneChoice == this.stim.primeTwoChoice == this.stim["goodPrimeTwoChoice"]),
        "responseChoice": this.stim.responseChoice, // rename response
        "rt": Date.now() - _s.trial_start,
        // could include time of response as well
      });
      document.getElementById("responseChoiceL").accessKey = null; // disable quick keys after trials are over
      document.getElementById("responseChoiceR").accessKey = null;
      document.getElementById("continueButton").accessKey = null;
      /* console logs for testing */
      // console.log('this trial…')
      // console.log(this.stim)
      // console.log('prime test')
      // console.log(exp.primeOneChoice == this.stim["goodPrimeOneChoice"] && exp.primeTwoChoice == this.stim["goodPrimeTwoChoice"])
      // console.log(exp.data_trials) // show the data, for testing
    }
  });



  slides.subj_info = slide({
    start: function() {

      clearTrialKeys();
    },
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
  exp.structure = ["i0", "consent", "instructions", "keyboard", "example", "trial", "subj_info", "thanks"];

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