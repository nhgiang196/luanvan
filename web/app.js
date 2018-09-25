/**
 * Created by wangyanyan on 14-3-3.
 */




define(['angular','angular-sanitize','angular-route','angular-cookies','angular-filter','uiselect2','ui-grid','angular-translate','angular-translate-loader-static-files','xlsxfull'], function(angular){


        return   angular.module('tasklist', ['ngResource','angularFileUpload','ngSanitize','ngRoute','ngCookies','angular.filter',
            'ui.select2','ui.grid','ui.grid.pinning','ui.grid.resizeColumns','ui.grid.selection','ui.grid.exporter', 'ui.grid.importer',
            'ui.grid.autoResize','ui.grid.edit','ui.grid.expandable','ui.grid.rowEdit','ui.grid.cellNav', 'ui.grid.pagination',
            'ui.grid.grouping','ui.grid.moveColumns','pascalprecht.translate','io-barcode']);

});