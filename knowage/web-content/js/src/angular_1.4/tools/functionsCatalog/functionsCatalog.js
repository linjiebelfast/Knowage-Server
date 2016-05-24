
var app = angular.module('functionsCatalogControllerModule',['ngMaterial', 'angular_list', 'angular_table','sbiModule', 'angular_2_col','file_upload','angular-list-detail']);
app.config(['$mdThemingProvider', function($mdThemingProvider) {
    $mdThemingProvider.theme('knowage')
    $mdThemingProvider.setDefaultTheme('knowage');
 }]);
app.controller('functionsCatalogController',["sbiModule_translate", "sbiModule_restServices", "$scope", "$mdDialog", "$mdToast","$log", "sbiModule_download","sbiModule_messaging",functionsCatalogFunction]);

function functionsCatalogFunction(sbiModule_translate, sbiModule_restServices, $scope, $mdDialog, $mdToast,$log,sbiModule_download,sbiModule_messaging){

	$scope.showDetail=false;
	$scope.shownFunction={};
	$scope.datasetLabelList=[];
	$scope.tableSelectedFunction={};
	$scope.tableSelectedFunction.language="Python";
	$scope.languages=["Python","R"];
	$scope.outputTypes=["SpagoBI Dataset","Text", "Image"];
	$scope.inputTypes=["Simple Input", "Dataset Input"]
	$scope.simpleInputs=[]; //=Input variables
	$scope.inputDatasets=[];	 
	$scope.varIndex=0;
	$scope.datasetsIndex=0;
	/*$scope.functionsList=[{"id":1,"name":"AVG","inputDatasets":[] , "inputVariables":[] , "outputItems":[], "language":"Python", "script": "var b=1;\n"},
	                       {"id":2,"name":"Variance","inputDatasets":[] , "inputVariables":[], "outputItems":[] , "language":"R", "script": "var c=2;\n"}];*/
	$scope.functionsList=[];
		
	$scope.newFunction={"id":"" ,"name":"","inputDatasets":[] , "inputVariables":[] , "outputItems":[],"language":"Python", "script":""};	
	$scope.cleanNewFunction=function()
	{
		$scope.newFunction={"id":"" ,"name":"","inputDatasets":[] , "inputVariables":[] , "outputItems":[], "language":"Python", "script":""};	
	}
	$scope.datasetLabelsList=[];
	$scope.saveOrUpdateFlag="";
	
	
	
	
	//Utility function
	

	function isEmpty(obj) {
		
		var hasOwnProperty = Object.prototype.hasOwnProperty;

	    // null and undefined are "empty"
	    if (obj == null) return true;

	    // Assume if it has a length property with a non-zero value
	    // that that property is correct.
	    if (obj.length > 0)    return false;
	    if (obj.length === 0)  return true;

	    // Otherwise, does it have any properties of its own?
	    // Note that this doesn't handle
	    // toString and valueOf enumeration bugs in IE < 9
	    for (var key in obj) {
	        if (hasOwnProperty.call(obj, key)) return false;
	    }

	    return true;
	}
	
	//--
	
	
	$scope.obtainCatalogFunctionsRESTcall=function()
	{		
		sbiModule_restServices.get("1.0/FunctionsCatalog","")
		.success(function(data)
		{			
				$log.info("Functions of the catalog returned", data);
				$scope.functionsList=data.functions;
				
		});			
	}	
	
	$scope.obtainDatasetLabelsRESTcall=function()
	{		
		sbiModule_restServices.get("2.0/datasets","listDataset")
		.success(function(datasets)
		{
			$log.info("Received Datasets ", datasets);			
				
			$scope.datasetsList=[];
			for(d in datasets.item)
			{
				//$log.info("d[label]", datasets.item[d].name);			
				$scope.datasetLabelsList.push(datasets.item[d].label);
				
			}
			$log.info("Dataset labels list", $scope.datasetLabelsList);			
	
		}); 
	}
	
	
	 
	
	
	$scope.addFunction=function()
	{
		$scope.shownFunction=$scope.newFunction;
		$scope.showDetail=true;
		$scope.saveOrUpdateFlag="save"
	}

	$scope.saveFunction=function()
	{
		var body={};		

		if($scope.saveOrUpdateFlag=="save")
		{
			
			$log.info("Save operation");

			
			body=$scope.shownFunction;
			
			$log.info("Shown function to send with POST", body);
	
			
			sbiModule_restServices.post("1.0/FunctionsCatalog","setCatalogFunction",body)
			.success(function(data)
			{			
					$log.info("Catalog Function Added!");
					$log.info("Function added to db with id: ",data);
					//$scope.functionsList.push(data);
					$scope.obtainCatalogFunctionsRESTcall();
					
					$scope.cleanNewFunction=function()
					{
						$scope.newFunction={"id":"" ,"name":"","inputDatasets":[] , "inputVariables":[] , "outputItems":[], "language":"Python", "script":""};	
					}
					$scope.shownFunction=$scope.newFunction;
	
			});
		}
		else if($scope.saveOrUpdateFlag=="update")
		{
			$log.info("Update operation");
			body=$scope.shownFunction;
			functionId=$scope.shownFunction.id;
			$log.info("Shown function to send with PUT", body);
	

			sbiModule_restServices.put("1.0/FunctionsCatalog","updateCatalogFunction/"+functionId,body)
			.success(function(data)
			{			
					$log.info("Catalog Function Updated!");
					$log.info("Message returned: ",data);
					//$scope.functionsList.push(data); 
					$scope.obtainCatalogFunctionsRESTcall();
					
			}); 
			
			
			
			
		}	
		
		
		
	}
	
	
	$scope.acSpeedMenu= [
	                      {
	                    	  label:sbiModule_translate.load("Delete"),
	                    	  icon:'fa fa-trash',
	                    	  action:function(item,event){
	                    		  $scope.deleteFunction(item,event);
	                    	  }
	                      	},
		                    {
		                      label:sbiModule_translate.load("Apply"),
		                      icon:'fa fa-play-circle',		 
		                      action:function(item,event){
		                    	  $scope.applyItem(item,event);
		                      }
		                    }
	                  
	                     ];
	
	$scope.deleteFunction=function(item,event){
 
		$scope.shownFunction=angular.copy(item);
		var functionId=$scope.shownFunction.id;
		
		sbiModule_restServices.get("1.0/FunctionsCatalog","deleteFunction/"+functionId)
		.success(function(data)
		{			
				$log.info("Catalog Function Deleted!");
				$log.info("Message returned: ",data);
				$scope.obtainCatalogFunctionsRESTcall();
				$scope.cleanNewFunction(); 
				$scope.shownFunction=$scope.newFunction;
				$scope.saveOrUpdateFlag="save";


		}); 
		
		
	};
	
	
	
	$scope.applyItem=function(item,event){ 
		
		var functionId=item.id;
		
		sbiModule_restServices.get("executeFunction",functionId)
		.success(function(result)
		{
			$log.info("Execution o function "+ functionId+" started, result:", result);			
				
		});
		
		
		
	};
	
	
	$scope.leftTableClick=function(item)
	{
		$scope.showDetail=true;
		$scope.shownFunction=angular.copy(item);
		//$scope.shownFunction=item;
		$scope.cleanNewFunction();
		$log.info("ShownFunction: ",$scope.shownFunction);
		$scope.saveOrUpdateFlag="update";

	}
	/*
	$scope.addInputItem=function()
	{
		$scope.cleanNewFunction();
		var inputItem={};

		//Mi procuro la lista di label dei dataset da mostrare nel caso il tipo di inputItem fosse SpagoBI Dataset
		
		sbiModule_restServices.get("2.0/datasets","listDataset")
		.success(function(datasets)
		{
			$log.info("Received Datasets ", datasets);			
				
			$scope.datasetsList=[];
			for(d in datasets.item)
			{
				$log.info("d[label]", datasets.item[d].name);			
				$scope.datasetsList.push(datasets.item[d].label);
				
			}
			$log.info("Datasets list", $scope.datasetsList);			

		});
			
		
		$scope.shownFunction.inputItems.push(inputItem);
		$log.info("Added an input ",$scope.shownFunction.inputItems);
		return inputItem;
	}
	*/
	
	$scope.addInputDataset=function() 
	{
		$scope.cleanNewFunction();
		var inputDataset={};

		//Mi procuro la lista di label dei dataset da mostrare nel caso il tipo di inputItem fosse SpagoBI Dataset
	
		$scope.shownFunction.inputDatasets.push(inputDataset);
		$log.info("Added an input Dataset ",$scope.shownFunction.inputDatasets);
		return inputDataset;
	}
	
	
	$scope.removeInputDataset=function(inputDataset)
	{
		var index=$scope.shownFunction.inputDatasets.indexOf(inputDataset);		
		$scope.shownFunction.inputDatasets.splice(index, 1);
		$log.info("Removed an input Dataset ",$scope.shownFunction.inputDatasets);
	}
	
	
	$scope.addDatasetFunc=function()
	{

	}
	
	$scope.removeDatasetFunc=function(dataset) 
	{		

		
	}
	
	$scope.addOutputItem=function()
	{
		var output={};
		$scope.shownFunction.outputItems.push(output);
		$log.info("Added an outputItem ",$scope.shownFunction.outputItems);
		return output;	
	}
	
	$scope.removeOutputItem=function(output)
	{		
		var output={};
		$scope.shownFunction.outputItems.push(output);
		$log.info("Added an outputItem ",$scope.shownFunction.outputItems);
		return output;
	}
	
	//----------------------------------------------Application Logic-----------------------------------------
	

	$scope.obtainDatasetLabelsRESTcall();
	$scope.obtainCatalogFunctionsRESTcall();
	
};













