function addCalculatedFieldController($scope, $mdDialog,sbiModule_translate,sbiModule_restServices, selectedBusinessModel,metaModelServices){
	$scope.translate=sbiModule_translate;
	$scope.selectedBusinessModel=selectedBusinessModel;
	$scope.type=[{label:sbiModule_translate.load("sbi.lookup.asString"),name:"String"},{label:sbiModule_translate.load("sbi.lookup.asNumber"),name:"Number"}]
	$scope.calcField={expression:"",dataType:$scope.type[0].name};
	$scope.cancel = function(){
		$mdDialog.cancel();
	};
	$scope.createCalculatedField=function(){
		 var dataToSend=metaModelServices.createRequestRest($scope.calcField);
		 dataToSend.data.sourceTableName=selectedBusinessModel.uniqueName;
		sbiModule_restServices.promisePost("1.0/metaWeb","setCalculatedField",dataToSend)
		.then(function(response){
			metaModelServices.applyPatch(response.data);
			$mdDialog.hide();
		}
		,function(response){
			sbiModule_restServices.errorHandler(response.data,sbiModule_translate.load("sbi.meta.business.calculatedField.create.error"))
		})
	}

	$scope.functions=[
		                  {
		                	  label:"+",
		                	  name:sbiModule_translate.load("sbi.meta.business.calculatedField.sum"),
		                	  value:"+"
		                  },
		                  {
		                	  label:"-",
		                	  name:sbiModule_translate.load("sbi.meta.business.calculatedField.subtraction"),
		                	  value:"-"
		                  },
		                  {
		                	  label:"*",
		                	  name:sbiModule_translate.load("sbi.meta.business.calculatedField.multiplication"),
		                	  value:"*"
		                  },
		                  {
		                	  label:"/",
		                	  name:sbiModule_translate.load("sbi.meta.business.calculatedField.division"),
		                	  value:"/"
		                  },
		                  {
		                	  label:"|",
		                	  name:sbiModule_translate.load("sbi.meta.business.calculatedField.or"),
		                	  value:"|"
		                  }
	                  ];
	$scope.dateFunctions=[
		                  {
		                	  label:"< GG <",
		                	  name:sbiModule_translate.load("sbi.meta.business.calculatedField.GG_between_dates"),
		                	  value:"GG_between_dates"
		                  },
		                  {
		                	  label:"< MM <",
		                	  name:sbiModule_translate.load("sbi.meta.business.calculatedField.MM_between_dates"),
		                	  value:"MM_between_dates"
		                  },
		                  {
		                	  label:"< AA <",
		                	  name:sbiModule_translate.load("sbi.meta.business.calculatedField.AA_between_dates"),
		                	  value:"AA_between_dates"
		                  },
		                  {
		                	  label:"GG++",
		                	  name:sbiModule_translate.load("sbi.meta.business.calculatedField.GG_up_today"),
		                	  value:"GG_up_today"
		                  },
		                  {
		                	  label:"MM++",
		                	  name:sbiModule_translate.load("sbi.meta.business.calculatedField.MM_up_today"),
		                	  value:"MM_up_today"
		                  },
		                  {
		                	  label:"AA++",
		                	  name:sbiModule_translate.load("sbi.meta.business.calculatedField.AA_up_today"),
		                	  value:"AA_up_today"
		                  }
	                  ];


	$scope.addCol=function(col){
		$scope.calcField.expression+=col.name;
	};
	$scope.addFunc=function(func){
		$scope.calcField.expression+=func.value;
	}
}