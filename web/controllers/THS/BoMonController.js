define([
  "myapp",
  "controllers/EHS/Waste/Directive/BoMonDirective",
  "angular"
], function(myapp, angular) {
  myapp.controller("BoMonController", [
    "$filter",
    "Notifications",
    "Auth",
    "EngineApi",
    "BoMonService",
    "WasteItemService",
    "CompanyService",
    "$translate",
    "$q",
    "$scope",
    "$routeParams",
    function(
      $filter,
      Notifications,
      Auth,
      EngineApi,
      BoMonService,
      WasteItemService,
      CompanyService,
      $translate,
      $q,
      $scope,
      $routeParams
    ) {
      var lang = window.localStorage.lang;
      $scope.recod = {};
      $scope.onlyOwner = true;
      $scope.isError = false;
      $scope.status = "";
      var paginationOptions = {
        pageNumber: 1,
        pageSize: 50,
        totalItems: 0,
        sort: null
      };
      var full_lsWastItems = [];
      var full_lsCompany = [];
      $scope.disableProcessComp = false;
      /**
       * Init data
       */

      $scope.statuslist = [
        {
          id: "1",
          name: $translate.instant("0")
        },
        {
          id: "0",
          name: $translate.instant("1")
        },
        {
          id: "X",
          name: $translate.instant("X")
        }
      ];

      /**
       * Load BoMonDetail
       */
      function loadBoMonDetail(id) {
        var deferred = $q.defer();
        BoMonService.FindByID(
          {
            BM: id
          },
          function(data) {
            $scope.recod.id = data.BM;
            $scope.recod.ten = data.TenBM;
          },
          function(error) {
            deferred.reject(error);
          }
        );
        return deferred.promise;
      }

      /**
       * Load Department into Combobox
       * */
      function loadDepartment() {
        var deferred = $q.defer();
        var query = {
          DepartType: "Department",
          lang: lang
        };
        BoMonService.GetDepartment(
          query,
          function(data) {
            $scope.departments = data;
            deferred.resolve(data);
          },
          function(error) {
            deferred.resolve(error);
          }
        );
        query.DepartType = "CenterDepartment";
        BoMonService.GetDepartment(
          query,
          function(data) {
            $scope.cdepartments = data;
            deferred.resolve(data);
          },
          function(error) {
            deferred.resolve(error);
          }
        );
      }
      function loadCompany() {
        var deferred = $q.defer();
        CompanyService.GetCompany(
          function(data) {
            $scope.company = full_lsCompany = data;
            deferred.resolve(data);
          },
          function(error) {
            deferred.resolve(error);
          }
        );
      }
      /**
       * Load WasteItems (update entities)
       */
      function loadWasteItems() {
        var deferred = $q.defer();
        var query = {
          WasteID: "",
          lang,
          ProcessComp: ""
        };
        WasteItemService.GetWasteItemLang(
          query,
          function(data) {
            full_lsWastItems = data;
            deferred.resolve(data);
          },
          function(error) {
            deferred.resolve(error);
          }
        );
      }

      /**
       * Define All Columns in UI Grid
       */
      var col = [
        {
          field: "BM",
          minWidth: 120,
          displayName: $translate.instant("BM"),
          cellTooltip: true,
          visible: true,
          cellTemplate:
            '<a href="#/waste/BoMon/print/{{COL_FIELD}}" style="padding:5px;display:block; cursor:pointer" target="_blank">{{COL_FIELD}}</a>'
        },
        {
          field: "OwnerComp",
          displayName: $translate.instant("OwnerComp"),
          minWidth: 120,
          cellTooltip: true,
          visible: false
        },
        {
          field: "ProcessComp",
          minWidth: 120,
          displayName: $translate.instant("ProcessComp"),
          cellTooltip: true
        },
        {
          field: "BoMonNumber",
          minWidth: 155,
          displayName: $translate.instant("BoMonNumber"),
          cellTooltip: true
        },
        {
          field: "DepartReq",
          minWidth: 100,
          displayName: $translate.instant("DepartReq"),
          cellTooltip: true
        },
        {
          field: "DepartProcess",
          minWidth: 100,
          displayName: $translate.instant("DepartProcess"),
          cellTooltip: true
        },
        {
          field: "InternalPhone",
          minWidth: 100,
          displayName: $translate.instant("InternalPhone"),
          cellTooltip: true
        },
        {
          field: "Location",
          minWidth: 120,
          displayName: $translate.instant("Location"),
          cellTooltip: true
        },
        {
          field: "SumTotal",
          minWidth: 80,
          displayName: $translate.instant("SumTotal"),
          cellTooltip: true
        },
        {
          field: "SumQty",
          minWidth: 80,
          displayName: $translate.instant("SumQty"),
          cellTooltip: true
        },
        {
          field: "UserID",
          minWidth: 100,
          displayName: $translate.instant("CreateBy"),
          cellTooltip: true
        },
        {
          field: "Status",
          displayName: $translate.instant("Status"),
          minWidth: 80,
          cellTooltip: true
        },
        {
          field: "CreateTime",
          displayName: $translate.instant("CreateTime"),
          width: 170,
          minWidth: 150,
          cellTooltip: true
        }
      ];
      /**
       * Query Grid setting
       */
      $scope.gridOptions = {
        columnDefs: col,
        data: [],
        enableColumnResizing: true,
        enableSorting: true,
        showGridFooter: false,
        enableGridMenu: true,
        exporterMenuPdf: false,
        enableSelectAll: false,
        enableRowHeaderSelection: true,
        enableRowSelection: true,
        multiSelect: false,
        paginationPageSizes: [50, 100, 200, 500],
        paginationPageSize: 50,
        enableFiltering: false,
        exporterOlderExcelCompatibility: true,
        useExternalPagination: true,
        enablePagination: true,
        enablePaginationControls: true,
        onRegisterApi: function(gridApi) {
          $scope.gridApi = gridApi;
          EngineApi.getTcodeLink().get(
            {
              userid: Auth.username,
              tcode: "M1"
            },
            function(linkres) {
              if (linkres.IsSuccess) {
                gridApi.core.addToGridMenu(gridApi.grid, gridMenu);
              }
            }
          );
          ///gridApi.core.addToGridMenu(gridApi.grid, gridMenu);
          gridApi.selection.on.rowSelectionChanged($scope, function(row) {
            $scope.selectedSupID = row.entity.SupID;
          });
          gridApi.pagination.on.paginationChanged($scope, function(
            newPage,
            pageSize
          ) {
            paginationOptions.pageNumber = newPage;
            paginationOptions.pageSize = pageSize;
            $scope.Search();
          });
        }
      };

      /**
       *search list function
       */
      function SearchList() {
        var query = {
          userID: Auth.username,
          lang: lang
        };
        query.pageIndex = paginationOptions.pageNumber || "";
        query.pageSize = paginationOptions.pageSize || "";
        query.dateFrom = $scope.dateFrom || "";
        query.dateTo = $scope.dateTo || "";
        query.BM = "";
        query.BoMonNumber = $scope.BoMon_number || "";
        query.ProcessComp = $scope.process_comp || "";
        query.DepartProcess = $scope.depart_process || "";
        query.InternalPhone = "";
        query.DepartReq = $scope.DepartReq || "";

        query.Status = $scope.s_status || "";
        if ($scope.onlyOwner == true) query.isCheck = 1;
        else query.isCheck = 0;
        return query;
      }

      function deleteById(id) {
        var data = {
          BM: id
        };
        BoMonService.DeleteByBM(
          data,
          function(res) {
            if (res.Success) {
              $scope.Search();
              $("#myModal").modal("hide");
              $("#messageModal").modal("hide");
              $("#nextModal").modal("hide");
            } else {
              Notifications.addError({
                status: "error",
                message: $translate.instant("saveError") + res.Message
              });
            }
          },
          function(error) {
            Notifications.addError({
              status: "error",
              message: $translate.instant("saveError") + error
            });
          }
        );
      }
      /**
       *Search function for Button Search
       */
      $scope.Search = function() {
        var deferred = $q.defer();
        if (!$scope.checkErr()) {
          var deferred = $q.defer();
          var query = SearchList();
          BoMonService.Search(
            query,
            function(res) {
              $scope.gridOptions.data = res.TableData;
              $scope.gridOptions.totalItems = res.TableCount[0];
              //deferred.resolve(data);
            },
            function(error) {
              deferred.reject(error);
            }
          );
        }
      };

      var gridMenu = [
        {
          title: $translate.instant("Create"),
          action: function() {
            $scope.reset();
            $scope.recod.owner_comp = "DBF1EA58-1326-442B-B4C3-897063F4F7FE";
            $scope.status = "N";
            $scope.company = full_lsCompany.filter(x => x.Status == 1);
            $scope.lsWastItems = [];
            $("#ProcessComp").prop("disabled", false);
            $("#myModal").modal("show");
          },
          order: 1
        },
        {
          title: $translate.instant("Update"),
          action: function() {
            var resultRows = $scope.gridApi.selection.getSelectedRows();
            $scope.recod.comp_id = resultRows;
            $scope.status = "M"; //Set update Status
            if (resultRows.length == 1) {
              if (resultRows[0].Status != "X") {
                if (resultRows[0].UserID == Auth.username) {
                  var querypromise = loadBoMonDetail(resultRows[0].BM);
                  $("#ProcessComp").prop("disabled", true); //disable ProcessComp text
                  $scope.company = full_lsCompany;
                  querypromise.then(
                    function() {
                      $("#myModal").modal("show");
                    },
                    function(error) {
                      Notifications.addError({
                        status: "error",
                        message: error
                      });
                    }
                  );
                } else {
                  Notifications.addError({
                    status: "error",
                    message: $translate.instant("ModifyNotBelongUserID")
                  });
                }
              } else {
                Notifications.addError({
                  status: "error",
                  message: $translate.instant("Modified_to_X")
                });
              }
            } else {
              Notifications.addError({
                status: "error",
                message: $translate.instant("Select_ONE_MSG")
              });
            }
          },
          order: 2
        },
        {
          title: $translate.instant("Delete"),
          action: function() {
            var resultRows = $scope.gridApi.selection.getSelectedRows();
            if (resultRows[0].UserID == Auth.username) {
              if (resultRows.length == 1) {
                if (
                  confirm(
                    $translate.instant("Delete_IS_MSG") + ":" + resultRows[0].BM
                  )
                ) {
                  deleteById(resultRows[0].BM);
                }
              } else {
                Notifications.addError({
                  status: "error",
                  message: $translate.instant("Select_ONE_MSG")
                });
              }
            } else {
              Notifications.addError({
                status: "error",
                message: $translate.instant("ModifyNotBelongUserID")
              });
            }
          },
          order: 3
        }
        // , {
        //     title: $translate.instant('PrintReport'),
        //     action: function () {
        //         var resultRows = $scope.gridApi.selection.getSelectedRows();

        //         if (resultRows.length == 1) {
        //             var href = '#/waste/BoMon/print/' + resultRows[0].BM;
        //             window.open(href);
        //         } else {
        //             Notifications.addError({
        //                 'status': 'error',
        //                 'message': $translate.instant('Select_ONE_MSG')
        //             });
        //         }
        //     },
        //     order: 4
        // }
      ];

      $scope.deleteWasteItem = function(index) {
        $scope.wasteItems.splice(index, 1);
      };
      $scope.clear = function() {
        $scope.recod = {};

        $("#myModal").modal("hide");
      };
    }
  ]);
});
