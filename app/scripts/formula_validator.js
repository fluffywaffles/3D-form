var formula_default_validators = {
  email: function (i, v) {
    return /\w+@[A-z0-9.]+/.test(v)
  },
  password: function (i, v) {
    var special_chars = /[_\-!@#$%^&* `~]/;
    return v.length > 8
           && /\d+/.test(v)
           && special_chars.test(v);
  },
  text_name: function (i, v) {
    var ns = v.split(/\s+/);
    return v.length > 0 && ns.length == 2
                        && ns[0].length > 0
                        && ns[1].length > 0;
  }
}

var formula_validators = formula_default_validators;

function formula_set_validators (newValidators) {
  newValidators = newValidators || {};

  // NOTE(jordan): validators = _.extend(validators, new_validators)
  for (var validatorName in newValidators)
    formula_validators[validatorName] = newValidators[validatorName];
}

function formula_validate_input (i) {
  var inputIsValid = false;

  if (!i.required) return true;

  // NOTE(jordan): clean up after those dirty, dirty users ;)
  var value = i.value.trim()
    , type  = i.type
    , id    = i.id;

  // NOTE(jordan): alias for ease of access
  var validators = formula_validators;

  // NOTE(jordan): perform validation
  if (type in validators) {
    console.log('Validating ' + type + '...');
    console.log('With: ', validators[type]);
    inputIsValid = validators[type](i, value);
  } else {
    var type_id = type + '_' + id;
    if (type_id in validators) {
      console.log('Validating type/id ' + type_id + '...');
      console.log('With: ', validators[type_id]);
      inputIsValid = validators[type_id](i, value);
    } else {
      // NOTE(jordan): default
      console.log('Validating ' + type + '...');
      console.log('With: failover validator');
      inputIsValid = value.length > 0;
    }
  }

  // NOTE(jordan): i.next...Sibling.text... gets the content of the label
  console.log(i.nextElementSibling.textContent + " valid? " + inputIsValid);

  inputIsValid ? i.addClass("valid") : i.removeClass("valid");

  return inputIsValid;
}

function formula_inputs_valid (inputs) {
  function isValid(v) { return v === true; }

  return [].map.call(inputs, formula_validate_input).every(isValid);
}

function formula_page_is_valid () {
  // NOTE(jordan): reset timeout every time this is called
  if (this.go) (clearTimeout(this.go), delete this.go);
  this.go = formula_animator.tiltToRevealButton();
}

function formula_page_is_invalid () {
  formula_animator.unTilt();
}

function formula_validate (inputs, valid, invalid) {

  valid   = valid   || formula_page_is_valid;
  invalid  = invalid || formula_page_is_invalid;

  if (formula_inputs_valid(inputs)) {
    valid();
  } else {
    invalid();
  }
}