function renderTreemap(chartConf) {
	
	var points = [];

	var counter=0;
	
	for (var dataset in chartConf.data[0]){

		level = {
				id: "id_" + counter,
				name: dataset,
				color: chartConf.colors[counter]
				
		}
		counter++;
		points.push(level);
		func(chartConf.data[0][dataset],dataset, level);

	}

	function func(resultData, nameds, dataValue){
		var counter=0;
		for (var resultRecord in resultData){
			
			level = {

					id: dataValue.id + "_" + counter,
					name: resultRecord,
					parent: dataValue.id
			
			}
			
			if (resultData[resultRecord].value){
				
				level.value = Math.round(Number(resultData[resultRecord].value));
				points.push(level);
			}
			else{
				
				points.push(level);
				func(resultData[resultRecord], resultRecord, level);
				
			}

			counter++;
		}

	}
	
	var chartObject = null;
    
    if (chartConf.chart.height==""
    		|| chartConf.chart.width=="")
	{
    	chartObject = 
    	{
    			renderTo: 'mainPanel',    			
//    			height: (chartConf.chart.height!=undefined || chartConf.chart.height!="") ? chartConf.chart.height : "",
//    			width: (chartConf.chart.width!=undefined || chartConf.chart.width!="") ? chartConf.chart.width : "",
    			marginTop: chartConf.chart.marginTop ? chartConf.chart.marginTop : undefined,
    			style: {
    				fontFamily: chartConf.chart.style.fontFamily,
    				fontSize: chartConf.chart.style.fontSize,
    				fontWeight: chartConf.chart.style.fontWeight,    				
    				fontStyle: chartConf.chart.style.fontStyle ? chartConf.chart.style.fontStyle : "",
    				textDecoration: chartConf.chart.style.textDecoration ? chartConf.chart.style.textDecoration : "",
    				fontWeight: chartConf.chart.style.fontWeight ? chartConf.chart.style.fontWeight : ""
    			},
    			
    			/**
    			 * Leave some ebough space for the "Back" button for drill up.
    			 * @author Danilo Ristovski (danristo, danilo.ristovski@mht.net)
    			 */
    			marginBottom: chartConf.chart.marginBottom
		};
    	
    	if (chartConf.chart.backgroundColor!=undefined && chartConf.chart.backgroundColor!="")
    		chartObject.backgroundColor = chartConf.chart.backgroundColor;
	}
    else if (chartConf.chart.height!=""
    		&& chartConf.chart.width!="")
	{
    	chartObject =     	
    	{
			renderTo: 'mainPanel',
			height:  Number(chartConf.chart.height),
			width:  Number(chartConf.chart.width),
			marginTop: chartConf.chart.marginTop ? chartConf.chart.marginTop : undefined,
			style: {
				fontFamily: chartConf.chart.style.fontFamily,
				fontSize: chartConf.chart.style.fontSize,
				fontWeight: chartConf.chart.style.fontWeight,
				fontStyle: chartConf.chart.style.fontStyle ? chartConf.chart.style.fontStyle : "",
				textDecoration: chartConf.chart.style.textDecoration ? chartConf.chart.style.textDecoration : "",
				fontWeight: chartConf.chart.style.fontWeight ? chartConf.chart.style.fontWeight : ""
			},
			
			marginBottom: chartConf.chart.marginBottom
		};
    	
    	if (chartConf.chart.backgroundColor!=undefined && chartConf.chart.backgroundColor!="")
    		chartObject.backgroundColor = chartConf.chart.backgroundColor;
	}
     
    /**
	 * Take drill up button (the "Back" button) setting from the VM.
	 * @author Danilo Ristovski (danristo, danilo.ristovski@mht.net)
	 */
    var drillUpButtonSettings = chartConf.series[0].drillUpButton;
        
	var chart = new Highcharts.Chart({
		chart: chartObject,
		series: 
		[
         	{
         		/**
         		 * Customization of the "Back" button on the TREEMAP chart.
         		 * @author Danilo Ristovski (danristo, danilo.ristovski@mht.net)
         		 */
				drillUpButton: 
				{
	                position: 
	                {
	                    align: drillUpButtonSettings.position.align,
//	                    x: drillUpButtonSettings.position.x,
	                    verticalAlign: drillUpButtonSettings.position.verticalAlign,
	                    y: drillUpButtonSettings.position.y
	                },
	                
	                theme: 
	                {
	                    fill: drillUpButtonSettings.theme.fill,
	                    'stroke-width': drillUpButtonSettings.theme.strokeWidth,
	                    stroke: drillUpButtonSettings.theme.stroke,
	                    r: drillUpButtonSettings.theme.r,
	                    
	                    style:
	                    {
	                    	fontSize: drillUpButtonSettings.theme.style.fontSize
                    	},
	                    
	                    states: 
	                    {
	                        hover: 
	                        {
	                            //fill: drillUpButtonSettings.theme.states.hover.fill
	                        }
	                    }
	                }	
	            },
	            
			type: "treemap",
			layoutAlgorithm: 'squarified',
			allowDrillToNode: true,
			dataLabels: {
				enabled: false
			},
			levelIsConstant: false,
			levels: [{
				level: 1,
				dataLabels: {
					enabled: true
				},
				borderWidth: 3
			}],
			data: points,
			events:{
				click: function(event){
			        
					if(event.point.node.children.length==0){
						if(chartConf.crossNavigation.hasOwnProperty('crossNavigationDocumentName')){
		            		var params=getCrossParams(event.point);
		            	    handleCrossNavigationTo(params);
		            	}
					}
				}
			}
		}],
		subtitle: {
			text: chartConf.subtitle.text,
			align: chartConf.subtitle.style.textAlign,
			style: {
				color: chartConf.subtitle.style.fontColor,				
				fontSize: chartConf.subtitle.style.fontSize,
				fontFamily: chartConf.subtitle.style.fontFamily,
				fontStyle: chartConf.subtitle.style.fontStyle ? chartConf.subtitle.style.fontStyle : "none",
				textDecoration: chartConf.subtitle.style.textDecoration ? chartConf.subtitle.style.textDecoration : "none",
				fontWeight: chartConf.subtitle.style.fontWeight ? chartConf.subtitle.style.fontWeight : "none"
			}
		},
		title: {
			text: chartConf.title.text,
			align: chartConf.title.style.textAlign,
			style: {
				color: chartConf.title.style.fontColor,
				fontWeight: chartConf.title.style.fontWeight,
				fontSize: chartConf.title.style.fontSize,
				fontFamily: chartConf.title.style.fontFamily,
				fontStyle: chartConf.title.style.fontStyle ? chartConf.title.style.fontStyle : "none",
				textDecoration: chartConf.title.style.textDecoration ? chartConf.title.style.textDecoration : "none",
				fontWeight: chartConf.title.style.fontWeight ? chartConf.title.style.fontWeight : "none"
			}
		},
		noData: {
			text: chartConf.emptymessage.text,
			align: chartConf.emptymessage.style.textAlign,
			style: {
				color: chartConf.emptymessage.style.fontColor,
				fontWeight: chartConf.emptymessage.style.fontWeight,
				fontSize: chartConf.emptymessage.style.fontSize,
				fontFamily: chartConf.emptymessage.style.fontFamily,
				fontStyle: chartConf.emptymessage.style.fontStyle ? chartConf.emptymessage.style.fontStyle : "none",
				textDecoration: chartConf.emptymessage.style.textDecoration ? chartConf.emptymessage.style.textDecoration : "none",
				fontWeight: chartConf.emptymessage.style.fontWeight ? chartConf.emptymessage.style.fontWeight : "none"
			}
		},
		
		/**
		 * Credits option disabled/enabled for the TREEMAP chart. This option (boolean value)
		 * is defined inside of the VM for the TREEMAP chart. If enabled credits link appears
		 * in the right bottom part of the chart.
		 * @author: danristo (danilo.ristovski@mht.net)
		 */
		credits: 
        {
    		enabled: (chartConf.credits.enabled!=undefined) ? chartConf.credits.enabled : false
		},
		
		plotOptions:
		{
			series:
				{
					turboThreshold: chartConf.plotOptions.series.turboThreshold,
					colorByPoint: chartConf.plotOptions.series.colorByPoint
				}
		}
	});
     
      var getCrossParams= function(point){
    	  var params={
    	    		point:{
    	    			name: null, // category name
    	    	        value: null, // category  value
    	    	        crossNavigationDocumentName:null,
    	    	        crossNavigationDocumentParams:null,
    	    		
    	    		series:{ // serie name and value
    	    			name:null,
    	    			value: null	
    	    		},
    	    		group:{ // grouping category name and value
    	    			name:null,
    	    			value: null
    	    		}
    	    		}
    	    	};
    	    	
    	    	params.point.crossNavigationDocumentName=chartConf.crossNavigation.crossNavigationDocumentName;
    	    	params.point.crossNavigationDocumentParams=chartConf.crossNavigation.crossNavigationDocumentParams;
    	    	
    	    	params.point.value=point.name;
    	    	
    	    	params.point.series.value=point.value;
    	    	
    	        
    	    	return params;
      }
}

function renderHeatmap(chartConf){
    var start;
    
    var startDate= new Date(chartConf.additionalData.dateresult[0]);
    var endDate= new Date(chartConf.additionalData.dateresult[1]);
    var points=[];
    var data=chartConf.data[0];
    var minValue=data[0][chartConf.additionalData.serie.value];
    var maxValue=data[0][chartConf.additionalData.serie.value];
    
    for( i=0;i<data.length;i++ ){
    	if(data[i][chartConf.additionalData.serie.value]< minValue){
    		minValue=data[i][chartConf.additionalData.serie.value];
    	}
    	
    	if(data[i][chartConf.additionalData.serie.value] > maxValue){
    		maxValue=data[i][chartConf.additionalData.serie.value];
    	}
    	
    	var point={
    		"x":new Date(data[i][chartConf.additionalData.columns[0].value]).getTime(),
    		"y":chartConf.additionalData.storeresult.indexOf(data[i][chartConf.additionalData.columns[1].value]),
    		"value":data[i][chartConf.additionalData.serie.value],
    		"label":data[i][chartConf.additionalData.columns[1].value]
    	};
    	
    	points.push(point);
    }
    
    var colors=chartConf.colors;
    var colorStops=[];
    
    /**
     * Check if user specified only 1 color from the color palette. 
     * @modifiedBy: danristo (danilo.ristovski@mht.net)
     */    
    if (colors.length > 1)
	{
    	for(i=0;i<colors.length;i++){
        	var stop=[i*(1/(colors.length-1)),colors[i]];
        	colorStops.push(stop);
        }	
	}
    else
	{
    	/**
    	 * If user specified only one color from the color palette in order to specify the
    	 * color interval for this chart type, then the interval of colors goes from the 
    	 * white color ("#FFFFFF") (the most left color on the legend of the chart) to the 
    	 * one specified by the user (that single one, 'colors[0]').
    	 * @author: danristo (danilo.ristovski@mht.net)
    	 */
    	var startIntervalColor = "#FFFFFF";	// White color
    	
    	colorStops.push([0,startIntervalColor]);
    	colorStops.push([1,colors[0]]);
	}    
    
    var chartObject = null;
    
    if (chartConf.chart.height==""
    		|| chartConf.chart.width=="")
	{
    	chartObject = 
    	{
        	renderTo: 'mainPanel',
            type: 'heatmap',
            backgroundColor:chartConf.chart.style.backgroundColor,
            //margin: [80, 80, 80, 80],
            
            /**
             * danristo
             */
//            marginTop: 100,
//            marginBottom: 100,
//            marginLeft: 200,
//            marginRight: 200,
            
			style: {
	            fontFamily: chartConf.chart.style.fontFamily,
	            fontSize: chartConf.chart.style.fontSize,
				fontStyle: chartConf.chart.style.fontStyle ? chartConf.chart.style.fontStyle : "",
				textDecoration: chartConf.chart.style.textDecoration ? chartConf.chart.style.textDecoration : "",
				fontWeight: chartConf.chart.style.fontWeight ? chartConf.chart.style.fontWeight : ""
	        
			}
    	};
	}
    else if (chartConf.chart.height!=""
    		&& chartConf.chart.width!="")
	{
    	chartObject = 
    	{
        	renderTo: 'mainPanel',
        	height:  Number(chartConf.chart.height),
			width:  Number(chartConf.chart.width),
            type: 'heatmap',
            backgroundColor:chartConf.chart.style.backgroundColor,
            //margin: [200, 200, 200, 200],
            
            /**
             * danristo
             */
//            marginTop: 100,
//            marginBottom: 100,
//            marginLeft: 150,
//            marginRight: 150,
            
			style: {
	            fontFamily: chartConf.chart.style.fontFamily,
	            fontSize: chartConf.chart.style.fontSize,
				fontStyle: chartConf.chart.style.fontStyle ? chartConf.chart.style.fontStyle : "none",
				textDecoration: chartConf.chart.style.textDecoration ? chartConf.chart.style.textDecoration : "none",
				fontWeight: chartConf.chart.style.fontWeight ? chartConf.chart.style.fontWeight : "none"
	        
			}
    	};
	}
    
    var chartHeight = (chartConf.chart.height!="") ? chartConf.chart.height : window.innerHeight;
    
    var chart = new Highcharts.Chart({
       
    	chart: chartObject,
        title: {
			text: chartConf.title.text,
            align: chartConf.title.style.textAlign,
			style: {
                color: chartConf.title.style.fontColor,
                fontSize: chartConf.title.style.fontSize,
                fontFamily: chartConf.title.style.fontFamily,
                fontStyle: chartConf.title.style.fontStyle ? chartConf.title.style.fontStyle : "none",
				textDecoration: chartConf.title.style.textDecoration ? chartConf.title.style.textDecoration : "none",
				fontWeight: chartConf.title.fontWeight ? chartConf.title.fontWeight : "none"
            }
		},
		subtitle: {
			text: chartConf.subtitle.text,
            align: chartConf.subtitle.style.textAlign,
			style: {
                color: chartConf.subtitle.style.fontColor,
                fontSize: chartConf.subtitle.style.fontSize,
                fontFamily: chartConf.subtitle.style.fontFamily,
                fontStyle: chartConf.subtitle.style.fontStyle ? chartConf.subtitle.style.fontStyle : "none",
				textDecoration: chartConf.subtitle.style.textDecoration ? chartConf.subtitle.style.textDecoration : "none",
				fontWeight: chartConf.subtitle.fontWeight ? chartConf.subtitle.fontWeight : "none"
            }
		},
		
		noData: {
			text: chartConf.emptymessage.text,
			align: chartConf.emptymessage.style.textAlign,
			style: {
                color: chartConf.emptymessage.style.fontColor,
                fontSize: chartConf.emptymessage.style.fontSize,
                fontFamily: chartConf.emptymessage.style.fontFamily,
                fontStyle: chartConf.emptymessage.style.fontStyle ? chartConf.emptymessage.style.fontStyle : "none",
				textDecoration: chartConf.emptymessage.style.textDecoration ? chartConf.emptymessage.style.textDecoration : "none",
				fontWeight: chartConf.emptymessage.fontWeight ? chartConf.emptymessage.fontWeight : "none"
            }
		},

        xAxis: {
            type: 'datetime', // the numbers are given in milliseconds
            min: Date.UTC(startDate.getUTCFullYear(),startDate.getUTCMonth(),startDate.getUTCDate()),  // gets range from variables 
            max: Date.UTC(endDate.getUTCFullYear(),endDate.getUTCMonth(),endDate.getUTCDate()),  
            
            title:
        	{
            	text: (chartConf.xaxis.title.text!=undefined && chartConf.xaxis.title.text!="") ? chartConf.xaxis.title.text : undefined,	
            	align: chartConf.xaxis.title.align,
            	
            	style:
        		{
            		color: (chartConf.xaxis.title.style.color!=undefined && chartConf.xaxis.title.style.color!="") ? chartConf.xaxis.title.style.color : '',	
    				fontStyle: (chartConf.xaxis.title.style.fontStyle!=undefined && chartConf.xaxis.title.style.fontStyle!="") ? chartConf.xaxis.title.style.fontStyle : '',
					textDecoration: (chartConf.xaxis.title.style.textDecoration!=undefined && chartConf.xaxis.title.style.textDecoration!="") ? chartConf.xaxis.title.style.textDecoration : '',
					fontSize: (chartConf.xaxis.title.style.fontSize!=undefined && chartConf.xaxis.title.style.fontSize!="") ? chartConf.xaxis.title.style.fontSize : '',
					fontFamily:(chartConf.xaxis.title.style.fontFamily!=undefined && chartConf.xaxis.title.style.fontFamily!="") ? chartConf.xaxis.title.style.fontFamily : ''
        		}
        	},
            
            labels: {
                x: 5,
                y: 15,
                format: '{value:%B %Y}',// long month
                rotation: (chartConf.xaxis.labels.rotation!=undefined && chartConf.xaxis.labels.rotation!="") ? chartConf.xaxis.labels.rotation : '',	
                align: (chartConf.xaxis.labels.align!=undefined && chartConf.xaxis.labels.align!="") ? chartConf.xaxis.labels.align : '',	
                style:{
                	color: (chartConf.xaxis.labels.style.color!=undefined && chartConf.xaxis.labels.style.color!="") ? chartConf.xaxis.labels.style.color : "",
                    fontStyle:(chartConf.xaxis.labels.style.fontStyle!=undefined && chartConf.xaxis.labels.style.fontStyle!="") ? chartConf.xaxis.labels.style.fontStyle : '',
                    textDecoration: (chartConf.xaxis.labels.style.textDecoration!=undefined && chartConf.xaxis.labels.style.textDecoration!="") ? chartConf.xaxis.labels.style.textDecoration : '',
                    fontSize: (chartConf.xaxis.labels.style.fontSize!=undefined && chartConf.xaxis.labels.style.fontSize!="") ? chartConf.xaxis.labels.style.fontSize : "",
                    fontFamily: (chartConf.xaxis.labels.style.fontFamily!=undefined && chartConf.xaxis.labels.style.fontFamily!="") ? chartConf.xaxis.labels.style.fontFamily : "",
           	}	
            },
            tickInterval:30*24*3600*1000,
            showLastLabel: true,
            tickLength: 16
        },

        yAxis: 
        {
        	title:
        	{
        		text: (chartConf.yaxis.title.text!=undefined && chartConf.yaxis.title.text!="") ? chartConf.yaxis.title.text : undefined,	
            	align: chartConf.yaxis.title.align,
            	
            	/**
            	 * Fixed value for margin of the Y-axis title. If the alignment of labels of the Y-axis
            	 * is "right", then take the value of 40 (default one, provided by the Highcharts library
            	 * for this property.
            	 * 
            	 * @author: danristo (danilo.ristovski@mht.net)
            	 */
            	margin: (chartConf.yaxis.labels.align!=undefined && chartConf.yaxis.labels.align!="" && chartConf.yaxis.labels.align!="right") ? 60 : 40,	
            	
    			style:
        		{
            		color: (chartConf.yaxis.title.style.color!=undefined && chartConf.yaxis.title.style.color!="") ? chartConf.yaxis.title.style.color : '',	
    				fontStyle: (chartConf.yaxis.title.style.fontStyle!=undefined && chartConf.yaxis.title.style.fontStyle!="") ? chartConf.yaxis.title.style.fontStyle : '',
					textDecoration: (chartConf.yaxis.title.style.textDecoration!=undefined && chartConf.yaxis.title.style.textDecoration!="") ? chartConf.yaxis.title.style.textDecoration : '',
					fontSize: (chartConf.yaxis.title.style.fontSize!=undefined && chartConf.yaxis.title.style.fontSize!="") ? chartConf.yaxis.title.style.fontSize : '',
					fontFamily:(chartConf.yaxis.title.style.fontFamily!=undefined && chartConf.yaxis.title.style.fontFamily!="") ? chartConf.yaxis.title.style.fontFamily : ''
        		}
        	},
            labels:{
            	rotation: (chartConf.yaxis.labels.rotation!=undefined && chartConf.yaxis.labels.rotation!="") ? chartConf.yaxis.labels.rotation : '',	
                align: (chartConf.yaxis.labels.align!=undefined && chartConf.yaxis.labels.align!="") ? chartConf.yaxis.labels.align : '',	
        		
        		/**
        		 * Provide the perfect left alignment when this one is selected (picked) by the user
        		 * for the labels alignment.
        		 * 
        		 * @author: danristo (danilo.ristovski@mht.net)
        		 */
        		x: 0,
                		
            	style:{            		
            		 color: (chartConf.yaxis.labels.style.color!=undefined && chartConf.yaxis.labels.style.color!="") ? chartConf.yaxis.labels.style.color : "",
                     fontStyle:(chartConf.yaxis.labels.style.fontStyle!=undefined && chartConf.yaxis.labels.style.fontStyle!="") ? chartConf.yaxis.labels.style.fontStyle : '',
                     textDecoration: (chartConf.yaxis.labels.style.textDecoration!=undefined && chartConf.yaxis.labels.style.textDecoration!="") ? chartConf.yaxis.labels.style.textDecoration : '',
                     fontSize: (chartConf.yaxis.labels.style.fontSize!=undefined && chartConf.yaxis.labels.style.fontSize!="") ? chartConf.yaxis.labels.style.fontSize : "",
                     fontFamily: (chartConf.yaxis.labels.style.fontFamily!=undefined && chartConf.yaxis.labels.style.fontFamily!="") ? chartConf.yaxis.labels.style.fontFamily : "",
            	}
            },
            categories:chartConf.additionalData.storeresult,
            reversed: false
        },

        colorAxis: {
        	 stops:colorStops ,
                 min: minValue,
                 max: maxValue,
            labels: {
                format: '{value}'
            }
        },
        
//        legend: {
//            layout: 'vertical',
//            align: chartConf.legend.style.align, 
//            symbolWidth: Number(20)	// modified by: (danilo.ristovski@mht.net)
//        },
        
        /**
         * Vertical legend of the HEATMAP will be positioned on the right side of the chart 
         * always (fixed values). Dynamic values are ones that user specifies for the height
         * of the legend and its position relative to the vertical orientation (top, middle,
         * bottom). 
         * 
         * @author: danristo (danilo.ristovski@mht.net)
         */
        legend: 
        {
            align: 'right',
            layout: 'vertical',
            verticalAlign: chartConf.legend.style.align,
            //y: (Number(chartHeight)-Number(chartConf.legend.symbolHeight))/2,
            symbolHeight: Number(chartConf.legend.symbolHeight),
            
            title:{
            	text:chartConf.legend.title.text?chartConf.legend.title.text:"none",
            	//align:chartConf.legend.title.style.align,
            	style:{
            		color: chartConf.legend.title.style.color?chartConf.legend.title.style.color:"none",
                    fontSize: chartConf.legend.title.style.fontSize?chartConf.legend.title.style.fontSize:"none",
                    fontFamily: chartConf.legend.title.style.fontFamily?chartConf.legend.title.style.fontFamily:"none",
                    fontStyle: chartConf.legend.title.style.fontStyle ? chartConf.legend.title.style.fontStyle : "none",
    				textDecoration: chartConf.legend.title.style.textDecoration ? chartConf.legend.title.style.textDecoration : "none",
    				fontWeight: chartConf.legend.title.fontWeight ? chartConf.legend.title.fontWeight : "none"
            	}	
            }
            
        },
        
        tooltip: {
        	headerFormat: '<b>'+chartConf.additionalData.serie.value+'</b><br/>',
            pointFormat: '{point.x:%e %b, %Y} | {point.label}: <b>{point.value}</b>',
            style:{ 
            	 color: chartConf.tooltip.style.fontColor,
                 fontSize: chartConf.tooltip.style.fontSize,
                 fontFamily: chartConf.tooltip.style.fontFamily
            }
        },
        series: [{
            borderWidth: 0,
            nullColor: '#EFEFEF',
            colsize: 24 * 36e5, // one day    
            data:points,
            events: {
            click: function(event){
            	if(chartConf.crossNavigation.hasOwnProperty('crossNavigationDocumentName')){
            		var params=getCrossParams(event.point);
            	    handleCrossNavigationTo(params);
            	}
            }
            },
            turboThreshold: Number.MAX_VALUE// #3404, remove after 4.0.5 release
        }],
        

        /**
		 * Credits option disabled/enabled for the HEATMAP chart. This option (boolean value)
		 * is defined inside of the VM for the HEATMAP chart. If enabled credits link appears
		 * in the right bottom part of the chart.
		 * @author: danristo (danilo.ristovski@mht.net)
		 */
		credits: 
        {
    		enabled: (chartConf.credits.enabled!=undefined) ? chartConf.credits.enabled : false
		}
    });
    
    var getCrossParams= function(point){
    	var params={
    		point:{
    			name: null, // category name
    	        value: null, // category  value
    	        crossNavigationDocumentName:null,
    	        crossNavigationDocumentParams:null,
    		
    		series:{ // serie name and value
    			name:null,
    			value: null	
    		},
    		group:{ // grouping category name and value
    			name:null,
    			value: null
    		}
    		}
    	};
    	
    	params.point.crossNavigationDocumentName=chartConf.crossNavigation.crossNavigationDocumentName;
    	params.point.crossNavigationDocumentParams=chartConf.crossNavigation.crossNavigationDocumentParams;
    	params.point.name=chartConf.additionalData.columns[0].value;
    	params.point.value= new Date(point.x);
    	params.point.series.name=chartConf.additionalData.serie.value;
    	params.point.series.value=point.value;
    	params.point.group.name=chartConf.additionalData.columns[1].value;
    	params.point.group.value=point.label;
        
    	return params;
    };
	
}