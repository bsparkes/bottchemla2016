function make_slides(f) {
  var slides = {};

  /* For Ling245, no need to change the code
   for i0 and consent slides*/
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
    start: function() {
      $(".err").hide();
      $('input[name=exChoice]:checked').prop('checked', false);
    },
    button: function() {
      // make sure participants understand
      // the task before they continue
      // response = $("#text_response").val();
      // if (response.length == 0) {
      //   $(".err").show();
      // } else {
      //   exp.data_trials.push({
      //     "trial_type" : "example",
      //     "response" : response
      //   });
      //   exp.go(); //make sure this is at the *end*, after you log your data
      // }
      exp.go(); //use exp.go() if and only if there is no "present" data.
    },
  });

  slides.trial = slide({ // the main slide

    name: "trial",
    start: function() {},


    present: trials, //trialOrder,

    //this gets run only at the beginning of the block, which means for each 'present' thing.
    present_handle: function(stim) {

      // Get the trial info. currentTrial picks up a value from the randomised list, which is fed to the
      // list of trials, which are dictionaries. So, exp.trialInf is the dictionary containing relevant info.
      exp.trialInf = trials[0] //[trialOrder[0]];

      specifyCards(exp.trialInf); // use trial dictionary build cards.

      // Uncheck card buttons and erase the previous values
      exp.criticalResponse = null;
      exp.primeOneChoice = null;
      exp.primeTwoChoice = null;
      exp.targetChoice = null;
      $('input[name=primeOneChoice]:checked').prop('checked', false);
      $('input[name=primeTwoChoice]:checked').prop('checked', false);
      $('input[name=targetChoice]:checked').prop('checked', false);
      $("#criticalSentence").html(stim);
      slide.condition = 0; // no card has been selected


      // hide everything but for the primeOne cards
      $(".err").hide();
      $(".targetContainerL").hide();
      $(".targetContainerR").hide();
      document.getElementById("targetChoiceL").accessKey = null;
      document.getElementById("targetChoiceR").accessKey = null;
      $(".primeTwoContainerL").hide();
      $(".primeTwoContainerR").hide();
      $(".primeOneContainerL").show();
      $(".primeOneContainerR").show();
      document.getElementById("primeOneChoiceL").accessKey = ",";
      document.getElementById("primeOneChoiceR").accessKey = ".";
      document.getElementById("continueButton").accessKey = "/";

      // show primeOne stimulus
      $("#trialCondition").html(conditionSentence(exp.trialInf["prime"], exp.trialInf["primeOneSymbols"][0]));

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
      been made we update to the second, and then to the target, when we store information and then
      move to the next trial.
      The function does this by checking in reverse, as target takes precedence over primeTwo, etc…
    */

    button: function() { // what to do when the lower button is clicked
      if (slide.condition == 1) { // so long as a button is clicked, we update…
        $(".err").hide(); // hide error
        exp.targetChoice = $('input[name=targetChoice]:checked').val(); // now update one button values
        exp.primeOneChoice = $('input[name=primeOneChoice]:checked').val();
        exp.primeTwoChoice = $('input[name=primeTwoChoice]:checked').val();
        if (exp.targetChoice != null) { // if one has chosen the target
          // currentTrial++ // increase trial counter
          this.log_responses(); // log responses
          _stream.apply(this); // store data
        } else if (exp.primeTwoChoice != null) { // if one has chosen the second prime…
          $("#trialCondition").html(conditionSentence(exp.trialInf["target"], exp.trialInf["targetSymbols"][0]));
          $(".primeTwoContainerL").hide();
          $(".primeTwoContainerR").hide();
          document.getElementById("primeTwoChoiceL").accessKey = null;
          document.getElementById("primeTwoChoiceR").accessKey = null;
          $(".targetContainerL").show();
          $(".targetContainerR").show();
          document.getElementById("targetChoiceL").accessKey = ",";
          document.getElementById("targetChoiceR").accessKey = ".";
          slide.condition = 0;
        } else if (exp.primeOneChoice != null) { // if one has chosen the first prime…
          $("#trialCondition").html(conditionSentence(exp.trialInf["prime"], exp.trialInf["primeTwoSymbols"][0]));
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
        "trial_type": "target",
        "trial_data": exp.trialInf, // store all trial data, as who knows…
        "primeOneChoice": exp.primeOneChoice,
        "gudPrimeOneChoice": exp.trialInf["gudPrimeOneChoice"],
        "correctPrimeOneChoice": (exp.primeOneChoice == exp.trialInf["gudPrimeOneChoice"]),
        "primeTwoChoice": exp.primeTwoChoice,
        "gudPrimeTwoChoice": exp.trialInf["gudPrimeTwoChoice"],
        "correctPrimeTwoChoice": (exp.primeTwoChoice == exp.trialInf["gudPrimeTwoChoice"]),
        "targetChoice": exp.targetChoice,
        // could include time of response as well
      });
      console.log('this trial…')
      console.log(exp.trialInf)
      // console.log(currentTrial)
      console.log('prime test')
      console.log(exp.primeOneChoice == exp.trialInf["gudPrimeOneChoice"] && exp.primeTwoChoice == exp.trialInf["gudPrimeTwoChoice"])
      console.log(exp.data_trials) // show the data, for testing
      console.log("trials")
      console.log(trials)
      // console.log("trialOrder")
      // console.log(trialOrder)
      // console.log("currentTrial")
      // console.log(currentTrial)
    }
  });


  slides.subj_info = slide({
    name: "subj_info",
    submit: function(e) {
      //if (e.preventDefault) e.preventDefault(); // I don't know what this means.
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
  exp.structure = ["i0", "instructions", "trial", //"subj_info",
    "thanks"
  ];


  exp.trialStims = {
    "comparatives": ["John ate more food than this burger.",
      "Mary had more pets than Fido."
    ],
    "multiple negations": ["No head injury is too severe to depair",
      "No head injury is too trivial to ignore"
    ]
  }[exp.condition];

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