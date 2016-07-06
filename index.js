var Agenda 		= require('agenda');
var moment 		= require('moment');

var mongoConnectionString = "mongodb://localhost/poc-agenda";
var agenda = new Agenda({ db: { address: mongoConnectionString } });
var starterTime = moment().add(15, 'seconds').format();

agenda.define('rodar integrações', function(job){
	console.log("***************************************************************************");
	
	var myArray = [];

	var fulltime = getResultsToRun().filter(function(obj){
		return obj.proximaExecucao == null;
	});

	var parameterized = getResultsToRun().filter(function(obj){
		return obj.proximaExecucao != null && moment().isAfter(moment(obj.proximaExecucao));
	});

	if(fulltime.length > 0){
		myArray.push(fulltime);
	}

	if(parameterized.length > 0){
		myArray.push(parameterized);
	}

	console.log(myArray);
});

agenda.on('ready', function(){
	agenda.every('5 seconds', 'rodar integrações');
	agenda.purge(function(err, numRemoved) {
		console.log(numRemoved);
	});
	agenda.start();
})

function getResultsToRun(){
	var obj = [{
		nome: "Integração full-time",
		proximaExecucao: null
	},{
		nome: "Integração parametrizada",
		proximaExecucao: starterTime
	}];

	return obj;
};