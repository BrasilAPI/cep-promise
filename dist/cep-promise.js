(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('isomorphic-unfetch')) :
	typeof define === 'function' && define.amd ? define(['isomorphic-unfetch'], factory) :
	(global.cep = factory(global.fetch));
}(this, (function (fetch) { 'use strict';

fetch = fetch && fetch.hasOwnProperty('default') ? fetch['default'] : fetch;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

var CepPromiseError = function (_Error) {
  inherits(CepPromiseError, _Error);

  function CepPromiseError() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        message = _ref.message,
        type = _ref.type,
        errors = _ref.errors;

    classCallCheck(this, CepPromiseError);

    var _this = possibleConstructorReturn(this, (CepPromiseError.__proto__ || Object.getPrototypeOf(CepPromiseError)).call(this));

    _this.name = 'CepPromiseError';
    _this.message = message;
    _this.type = type;
    _this.errors = errors;
    return _this;
  }

  return CepPromiseError;
}(Error);

var ServiceError = function (_Error) {
  inherits(ServiceError, _Error);

  function ServiceError() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        message = _ref.message,
        service = _ref.service;

    classCallCheck(this, ServiceError);

    var _this = possibleConstructorReturn(this, (ServiceError.__proto__ || Object.getPrototypeOf(ServiceError)).call(this));

    _this.name = 'ServiceError';
    _this.message = message;
    _this.service = service;
    return _this;
  }

  return ServiceError;
}(Error);

function fetchCorreiosService(cepWithLeftPad) {
  var proxyURL = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

  var url = proxyURL + 'https://apps.correios.com.br/SigepMasterJPA/AtendeClienteService/AtendeCliente';
  var options = {
    method: 'POST',
    body: '<?xml version="1.0"?>\n<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:cli="http://cliente.bean.master.sigep.bsb.correios.com.br/">\n  <soapenv:Header />\n  <soapenv:Body>\n    <cli:consultaCEP>\n      <cep>' + cepWithLeftPad + '</cep>\n    </cli:consultaCEP>\n  </soapenv:Body>\n</soapenv:Envelope>',
    headers: {
      'Content-Type': 'text/xml;charset=UTF-8',
      'cache-control': 'no-cache'
    }
  };

  return fetch(url, options).then(analyzeAndParseResponse).catch(throwApplicationError);
}

function analyzeAndParseResponse(response) {
  if (response.ok) {
    return response.text().then(parseSuccessXML).then(extractValuesFromSuccessResponse);
  }

  return response.text().then(parseAndextractErrorMessage).then(throwCorreiosError);
}

function parseSuccessXML(xmlString) {
  try {
    var returnStatement = xmlString.replace(/\r?\n|\r/g, '').match(/<return>(.*)<\/return>/)[0] || '';
    var cleanReturnStatement = returnStatement.replace('<return>', '').replace('</return>', '');
    var parsedReturnStatement = cleanReturnStatement.split(/</).reduce(function (result, exp) {
      var splittenExp = exp.split('>');
      if (splittenExp.length > 1 && splittenExp[1].length) {
        result[splittenExp[0]] = splittenExp[1];
      }
      return result;
    }, {});

    return parsedReturnStatement;
  } catch (e) {
    throw new Error('Não foi possível interpretar o XML de resposta.');
  }
}

function parseAndextractErrorMessage(xmlString) {
  try {
    var returnStatement = xmlString.match(/<faultstring>(.*)<\/faultstring>/)[0] || '';
    var cleanReturnStatement = returnStatement.replace('<faultstring>', '').replace('</faultstring>', '');
    return cleanReturnStatement;
  } catch (e) {
    throw new Error('Não foi possível interpretar o XML de resposta.');
  }
}

function throwCorreiosError(translatedErrorMessage) {
  throw new Error(translatedErrorMessage);
}

function extractValuesFromSuccessResponse(xmlObject) {
  return {
    cep: xmlObject.cep,
    state: xmlObject.uf,
    city: xmlObject.cidade,
    neighborhood: xmlObject.bairro,
    street: xmlObject.end
  };
}

function throwApplicationError(error) {
  var serviceError = new ServiceError({
    message: error.message,
    service: 'correios'
  });

  if (error.name === 'FetchError') {
    serviceError.message = 'Erro ao se conectar com o serviço dos Correios.';
  }

  throw serviceError;
}

function fetchViaCepService(cepWithLeftPad) {
  var proxyURL = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

  var url = proxyURL + 'https://viacep.com.br/ws/' + cepWithLeftPad + '/json/';
  var options = {
    method: 'GET',
    mode: 'cors',
    headers: {
      'content-type': 'application/json;charset=utf-8'
    }
  };

  return fetch(url, options).then(analyzeAndParseResponse$1).then(checkForViaCepError).then(extractCepValuesFromResponse).catch(throwApplicationError$1);
}

function analyzeAndParseResponse$1(response) {
  if (response.ok) {
    return response.json();
  }

  throw Error('Erro ao se conectar com o serviço ViaCEP.');
}

function checkForViaCepError(responseObject) {
  if (responseObject.erro === true) {
    throw new Error('CEP não encontrado na base do ViaCEP.');
  }

  return responseObject;
}

function extractCepValuesFromResponse(responseObject) {
  return {
    cep: responseObject.cep.replace('-', ''),
    state: responseObject.uf,
    city: responseObject.localidade,
    neighborhood: responseObject.bairro,
    street: responseObject.logradouro
  };
}

function throwApplicationError$1(error) {
  var serviceError = new ServiceError({
    message: error.message,
    service: 'viacep'
  });

  if (error.name === 'FetchError') {
    serviceError.message = 'Erro ao se conectar com o serviço ViaCEP.';
  }

  throw serviceError;
}

var PROXY_URL = 'https://proxier.now.sh/api?url=';

/* istanbul ignore next */
function isBrowser() {
  return typeof window !== 'undefined';
}

/* istanbul ignore next */
function injectProxy(Service) {
  return function (cepWithLeftPad) {
    return Service(cepWithLeftPad, PROXY_URL);
  };
}

var CorreiosService = isBrowser() ? injectProxy(fetchCorreiosService) : fetchCorreiosService;
var ViaCepService = fetchViaCepService;

var reverse = function reverse(promise) {
  return new Promise(function (resolve, reject) {
    return Promise.resolve(promise).then(reject, resolve);
  });
};

Promise.any = function (iterable) {
  return reverse(Promise.all([].concat(toConsumableArray(iterable)).map(reverse)));
};

var CEP_SIZE = 8;

function cepPromise (cepRawValue) {
  return Promise.resolve(cepRawValue).then(validateInputType).then(removeSpecialCharacters).then(validateInputLength).then(leftPadWithZeros).then(fetchCepFromServices).catch(handleServicesError).catch(throwApplicationError$2);
}

function validateInputType(cepRawValue) {
  var cepTypeOf = typeof cepRawValue === 'undefined' ? 'undefined' : _typeof(cepRawValue);

  if (cepTypeOf === 'number' || cepTypeOf === 'string') {
    return cepRawValue;
  }

  throw new CepPromiseError({
    message: 'Erro ao inicializar a instância do CepPromise.',
    type: 'validation_error',
    errors: [{
      message: 'Você deve chamar o construtor utilizando uma String ou um Number.',
      service: 'cep_validation'
    }]
  });
}

function removeSpecialCharacters(cepRawValue) {
  return cepRawValue.toString().replace(/\D+/g, '');
}

function leftPadWithZeros(cepCleanValue) {
  return '0'.repeat(CEP_SIZE - cepCleanValue.length) + cepCleanValue;
}

function validateInputLength(cepWithLeftPad) {
  if (cepWithLeftPad.length <= CEP_SIZE) {
    return cepWithLeftPad;
  }

  throw new CepPromiseError({
    message: 'CEP deve conter exatamente ' + CEP_SIZE + ' caracteres.',
    type: 'validation_error',
    errors: [{
      message: 'CEP informado possui mais do que ' + CEP_SIZE + ' caracteres.',
      service: 'cep_validation'
    }]
  });
}

function fetchCepFromServices(cepWithLeftPad) {
  return Promise.any([CorreiosService(cepWithLeftPad), ViaCepService(cepWithLeftPad)]);
}

function handleServicesError(aggregatedErrors) {
  if (aggregatedErrors.length !== undefined) {
    throw new CepPromiseError({
      message: 'Todos os serviços de CEP retornaram erro.',
      type: 'service_error',
      errors: aggregatedErrors
    });
  }
  throw aggregatedErrors;
}

function throwApplicationError$2(_ref) {
  var message = _ref.message,
      type = _ref.type,
      errors = _ref.errors;

  throw new CepPromiseError({ message: message, type: type, errors: errors });
}

return cepPromise;

})));
