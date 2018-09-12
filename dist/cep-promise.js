(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('isomorphic-unfetch')) :
	typeof define === 'function' && define.amd ? define(['exports', 'isomorphic-unfetch'], factory) :
	(factory((global.cep = {}),global.fetch));
}(this, (function (exports,fetch) { 'use strict';

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

var ResponseHelpers = {
  analyzeAndParseResponse: function analyzeAndParseResponse(response, serviceName) {
    if (response.ok) {
      return response.json();
    }
    throw Error('Erro ao se conectar com o servi\xE7o ' + serviceName + '.');
  },
  checkForViaCepError: function checkForViaCepError(response, serviceName) {
    if (response.erro === true) {
      throw new Error('CEP n\xE3o encontrado na base do ' + serviceName + '.');
    }
    return response;
  },
  extractCepValuesFromResponse: function extractCepValuesFromResponse(response, objectFields) {
    return {
      cep: response[objectFields.cep].replace('-', ''),
      state: response[objectFields.state],
      city: response[objectFields.city],
      neighborhood: response[objectFields.neighborhood],
      street: response[objectFields.street]
    };
  },
  throwApplicationError: function throwApplicationError(error, serviceName) {
    var serviceError = new ServiceError({
      message: error.message,
      service: serviceName.toLowerCase()
    });
    if (error.name === 'FetchError') {
      serviceError.message = 'Erro ao se conectar com o servi\xE7o ' + serviceName + '.';
    }
    throw serviceError;
  }
};

var CepAberto = function CepAberto(cepWithLeftPad) {
  var proxyURL = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

  var SERVICE_NAME = 'CepAberto';
  var url = proxyURL + 'http://www.cepaberto.com/api/v2/ceps.json?cep=' + cepWithLeftPad;
  var options = {
    method: 'GET',
    mode: 'cors',
    headers: {
      'content-type': 'application/json;charset=utf-8',
      'Authorization': 'Token token="37bfda18fd4b423cdb6748d14ba30aa6"'
    }
  };
  return fetch(url, options).then(function (response) {
    return ResponseHelpers.analyzeAndParseResponse(response, SERVICE_NAME);
  }).then(function (response) {
    return ResponseHelpers.checkForViaCepError(response, SERVICE_NAME);
  }).then(function (response) {
    return ResponseHelpers.extractCepValuesFromResponse(response, {
      cep: 'cep',
      state: 'estado',
      city: 'cidade',
      neighborhood: 'bairro',
      street: 'logradouro'
    });
  }).catch(function (e) {
    return ResponseHelpers.throwApplicationError(e, SERVICE_NAME);
  });
};

var _helpers = {
  analyzeAndParseResponse: function analyzeAndParseResponse(response) {
    if (response.ok) {
      return response.text().then(_helpers.parseSuccessXML).then(function (response) {
        return ResponseHelpers.extractCepValuesFromResponse(response, {
          cep: 'cep',
          state: 'uf',
          city: 'cidade',
          neighborhood: 'bairro',
          street: 'end'
        });
      });
    }
    return response.text().then(_helpers.parseAndextractErrorMessage).then(_helpers.throwCorreiosError);
  },
  parseSuccessXML: function parseSuccessXML(xmlString) {
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
  },
  parseAndextractErrorMessage: function parseAndextractErrorMessage(xmlString) {
    try {
      var returnStatement = xmlString.match(/<faultstring>(.*)<\/faultstring>/)[0] || '';
      var cleanReturnStatement = returnStatement.replace('<faultstring>', '').replace('</faultstring>', '');
      return cleanReturnStatement;
    } catch (e) {
      throw new Error('Não foi possível interpretar o XML de resposta.');
    }
  },
  throwCorreiosError: function throwCorreiosError(translatedErrorMessage) {
    throw new Error(translatedErrorMessage);
  }
};

var Correios = function Correios(cepWithLeftPad) {
  var proxyURL = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

  var SERVICE_NAME = 'Correios';
  var url = proxyURL + 'https://apps.correios.com.br/SigepMasterJPA/AtendeClienteService/AtendeCliente';
  var options = {
    method: 'POST',
    body: '<?xml version="1.0"?>\n<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:cli="http://cliente.bean.master.sigep.bsb.correios.com.br/">\n  <soapenv:Header />\n  <soapenv:Body>\n    <cli:consultaCEP>\n      <cep>' + cepWithLeftPad + '</cep>\n    </cli:consultaCEP>\n  </soapenv:Body>\n</soapenv:Envelope>',
    headers: {
      'Content-Type': 'text/xml;charset=UTF-8',
      'cache-control': 'no-cache'
    }
  };
  return fetch(url, options).then(_helpers.analyzeAndParseResponse).catch(function (e) {
    return ResponseHelpers.throwApplicationError(e, SERVICE_NAME);
  });
};

var ViaCep = function ViaCep(cepWithLeftPad) {
  var SERVICE_NAME = 'ViaCEP';
  var url = 'https://viacep.com.br/ws/' + cepWithLeftPad + '/json/';
  var options = {
    method: 'GET',
    mode: 'cors',
    headers: {
      'content-type': 'application/json;charset=utf-8'
    }
  };
  return fetch(url, options).then(function (response) {
    return ResponseHelpers.analyzeAndParseResponse(response, SERVICE_NAME);
  }).then(function (response) {
    return ResponseHelpers.checkForViaCepError(response, SERVICE_NAME);
  }).then(function (response) {
    return ResponseHelpers.extractCepValuesFromResponse(response, {
      cep: 'cep',
      state: 'uf',
      city: 'localidade',
      neighborhood: 'bairro',
      street: 'logradouro'
    });
  }).catch(function (e) {
    return ResponseHelpers.throwApplicationError(e, SERVICE_NAME);
  });
};

var PROXY_URL = 'https://cors-anywhere.herokuapp.com/';
var CEP_SIZE = 8;

/* istanbul ignore next */
function injectProxy(Service) {
  return function (cepWithLeftPad) {
    return Service(cepWithLeftPad, PROXY_URL);
  };
}

var CepAbertoService = typeof process === 'undefined' ? injectProxy(CepAberto) : CepAberto;
var CorreiosService = typeof process === 'undefined' ? injectProxy(Correios) : Correios;
var ViaCepService = typeof process === 'undefined' ? injectProxy(ViaCep) : ViaCep;

var reverse = function reverse(promise) {
  return new Promise(function (resolve, reject) {
    return Promise.resolve(promise).then(reject, resolve);
  });
};

Promise.any = function (iterable) {
  return reverse(Promise.all([].concat(toConsumableArray(iterable)).map(reverse)));
};

var _helpers$1 = {
  validateInputType: function validateInputType(cepRawValue) {
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
  },
  removeSpecialCharacters: function removeSpecialCharacters(cepRawValue) {
    return cepRawValue.toString().replace(/\D+/g, '');
  },
  leftPadWithZeros: function leftPadWithZeros(cepCleanValue) {
    return '0'.repeat(CEP_SIZE - cepCleanValue.length) + cepCleanValue;
  },
  validateInputLength: function validateInputLength(cepWithLeftPad) {
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
  },
  fetchCepFromServices: function fetchCepFromServices(cepWithLeftPad) {
    return Promise.any([CepAbertoService(cepWithLeftPad), CorreiosService(cepWithLeftPad), ViaCepService(cepWithLeftPad)]);
  },
  handleServicesError: function handleServicesError(aggregatedErrors) {
    if (aggregatedErrors.length !== undefined) {
      throw new CepPromiseError({
        message: 'Todos os serviços de CEP retornaram erro.',
        type: 'service_error',
        errors: aggregatedErrors
      });
    }
    throw aggregatedErrors;
  },
  throwApplicationError: function throwApplicationError(_ref) {
    var message = _ref.message,
        type = _ref.type,
        errors = _ref.errors;
    return new CepPromiseError({ message: message, type: type, errors: errors });
  }
};

var searchCEP = function searchCEP(cepRawValue) {
  return Promise.resolve(cepRawValue).then(_helpers$1.validateInputType).then(_helpers$1.removeSpecialCharacters).then(_helpers$1.validateInputLength).then(_helpers$1.leftPadWithZeros).then(_helpers$1.fetchCepFromServices).catch(_helpers$1.handleServicesError).catch(_helpers$1.throwApplicationError);
};

exports.searchCEP = searchCEP;
exports.default = searchCEP;

Object.defineProperty(exports, '__esModule', { value: true });

})));
