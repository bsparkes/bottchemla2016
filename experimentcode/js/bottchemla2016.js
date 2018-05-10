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

  slides.trial = slide({

    // exp.criticalResponse = slides.trial

    name: "trial",
    start: function() {

      $(".err").hide();
      console.log(currentTrial)

    },


    present: trialOrder, // [exp.trialInf],

    //this gets run only at the beginning of the block, which means for each 'present' thing.
    present_handle: function(stim) {

      exp.trialInf = trials[currentTrial];

      getSymbols(exp.trialInf["symbols"])

      $("#trialCondition").html(exp.condition + " " + exp.sym1t);

      makecard(canvasid = 'primeOneL', Math.floor(Math.random() * 3), 1)
      makecard(canvasid = 'primeOneR', Math.floor(Math.random() * 3), 2)
      makecard(canvasid = 'primeTwoL', Math.floor(Math.random() * 3), 3)
      makecard(canvasid = 'primeTwoR', Math.floor(Math.random() * 3), 6)
      makecard(canvasid = 'targetL', Math.floor(Math.random() * 3), 3)
      makecard(canvasid = 'targetR', Math.floor(Math.random() * 3), 6)

      $(".err").hide();
      $(".targetContainerL").hide();
      $(".targetContainerR").hide();
      $(".primeTwoContainerL").hide();
      $(".primeTwoContainerR").hide();
      $(".primeOneContainerL").show();
      $(".primeOneContainerR").show();



      // uncheck the button and erase the previous value
      exp.criticalResponse = null;
      exp.primeOneChoice = null;
      exp.primeTwoChoice = null;
      exp.targetChoice = null;
      $('input[name=primeOneChoice]:checked').prop('checked', false);
      $('input[name=primeTwoChoice]:checked').prop('checked', false);
      $('input[name=targetChoice]:checked').prop('checked', false);
      $("#criticalSentence").html(stim);

      this.stim = stim; // I like to store this information in the slide so I can record it later.
    },


    button: function() {
      //find out the checked option

      exp.primeOneChoice = $('input[name=primeOneChoice]:checked').val();
      exp.primeTwoChoice = $('input[name=primeTwoChoice]:checked').val();
      exp.targetChoice = $('input[name=targetChoice]:checked').val();

      console.log(exp.primeOneChoice)
      console.log(exp.primeTwoChoice)
      console.log(exp.targetChoice)

      // verify the response
      if (exp.primeOneChoice == null) {
        $(".err").show();
      } else {
        console.log('got one')
        $(".err").hide();
        $(".primeOneContainerL").hide();
        $(".primeOneContainerR").hide();
        $(".primeTwoContainerL").show();
        $(".primeTwoContainerR").show();

        if (exp.primeTwoChoice == null) {
          $(".err").show();
        } else {
          console.log('got two')
          $(".err").hide();
          $(".primeTwoContainerL").hide();
          $(".primeTwoContainerR").hide();
          $(".targetContainerL").show();
          $(".targetContainerR").show();

          if (exp.targetChoice == null) {
            $(".err").show()
          } else {
            console.log('got target')
            console.log(exp.data_trials)
            currentTrial++
            console.log(currentTrial)
            this.log_responses();

            /* use _stream.apply(this); if and only if there is
            "present" data. (and only *after* responses are logged) */
            _stream.apply(this);
          }
        }
      }
    },

    log_responses: function() {
      exp.data_trials.push({
        "trial_type": "critical",
        "trial_data": exp.trialInf,
        "primeOneChoice": exp.primeOneChoice,
        "primeTwoChoice": exp.primeTwoChoice,
        "targetChoice": exp.targetChoice,
      });
    }

  });

  slides.critical = slide({
    name: "critical",

    /* trial information for this block
     (the variable 'stim' will change between each of these values,
      and for each of these, present_handle will be run.) */
    present: _.shuffle([
      "John and Mary laugh.",
      "Does John and Mary laugh?",
      "John and I am happy."
    ]),

    //this gets run only at the beginning of the block
    present_handle: function(stim) {
      $(".err").hide();

      // uncheck the button and erase the previous value
      exp.criticalResponse == null;
      $('input[name=criticalChoice]:checked').prop('checked', false);
      $("#criticalSentence").html(stim);

      this.stim = stim; //you can store this information in the slide so you can record it later.

    },

    button: function() {
      //find out the checked option
      exp.criticalResponse = $('input[name=criticalChoice]:checked').val();

      // verify the response
      if (exp.criticalResponse == null) {
        $(".err").show();
      } else {
        this.log_responses();

        /* use _stream.apply(this); if and only if there is
        "present" data. (and only *after* responses are logged) */
        _stream.apply(this);
      }
    },

    log_responses: function() {
      exp.data_trials.push({
        "trial_type": "critical",
        //"sentence": this.stim, // don't forget to log the stimulus
        "response": exp.criticalResponse
      });
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
  //specify conditions
  exp.condition = _.sample(["Some of the symbols are", "There are four", "There is a"]); //can randomize between subject conditions here
  //blocks of the experiment:
  exp.structure = ["i0", "instructions", "trial", "trial", "trial", //"subj_info",
    "thanks"
  ];
  console.log(exp.structure)

  // bottchemla stuff
  exp.sym1 = 0
  exp.sym2 = 0
  // getSymbols()

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