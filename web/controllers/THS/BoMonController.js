define([
  "myapp",
  // "controllers/EHS/Waste/Directive/BoMonDirective",
  "angular"
], function (myapp, angular) {
  myapp.controller("BoMonController", [
    "$filter",
    "Notifications",
    "Auth",
    "EngineApi",
    "THSAdminService",
    "$translate",
    "$q",
    "$scope",
    function (
      $filter,
      Notifications,
      Auth,
      EngineApi,
      THSAdminService,
      $translate,
      $q,
      $scope
    ) {
      //PHAN DIRECTIVE
      $scope.flowkey = 'HW01';
      $scope.username = Auth.username;
      formVariables = $scope.formVariables = [];
      historyVariable = $scope.historyVariable = [];
      var lang = window.localStorage.lang;
      $scope.recod = {};
      $scope.isError = false;
      $scope.status = "";

      // var paginationOptions = {
      //   pageNumber: 1,
      //   pageSize: 50,
      //   totalItems: 0,
      //   sort: null
      // };
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
      * Define All Columns in UI Grid
      */
      var col = [
        {
          field: "BM",
          minWidth: 120,
          displayName: $translate.instant("BM"),
          cellTooltip: true,
          visible: true,
          // cellTemplate:
          //   '<a href="#/waste/BoMon/print/{{COL_FIELD}}" style="padding:5px;display:block; cursor:pointer" target="_blank">{{COL_FIELD}}</a>'
        },
        {
          field: "TenBM",
          displayName: $translate.instant("TenBM"),
          minWidth: 150,
          cellTooltip: true,
          visible: true
        },
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
        onRegisterApi: function (gridApi) {
          $scope.gridApi = gridApi;
          EngineApi.getTcodeLink().get(
            {
              userid: Auth.username,
              tcode: "A1"
            },
            function (linkres) {
              if (linkres.IsSuccess) {
                gridApi.core.addToGridMenu(gridApi.grid, gridMenu);
              }
            }
          );
          ///gridApi.core.addToGridMenu(gridApi.grid, gridMenu);
          gridApi.selection.on.rowSelectionChanged($scope, function (row) {
            $scope.selectedSupID = row.entity.SupID;
          });
          gridApi.pagination.on.paginationChanged($scope, function (
            newPage,
            pageSize
          ) {
            paginationOptions.pageNumber = newPage;
            paginationOptions.pageSize = pageSize;
            $scope.Search();
          });
        }
      };

      // /**
      // *search list function
      // */
      // function SearchList() {
      //   var query = {
      //     userID: Auth.username,
      //     lang: lang
      //   };
      //   query.pageIndex = paginationOptions.pageNumber || "";
      //   query.pageSize = paginationOptions.pageSize || "";
      //   return query;
      // }

      function deleteById(id) {
        var data = {
          action: 'remove',
          BM: id
        };
        THSAdminService.cudBoMon(
          data,
          function (res) {
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
          function (error) {
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
      $scope.Search = function () {
        var deferred = $q.defer();
        // if (!$scope.checkErr()) 
        var deferred = $q.defer();
        // var query = SearchList();
        var query = { table: 'BoMon' }
        THSAdminService.GetAll(
          query,
          function (res) {
            $scope.gridOptions.data = res.TableData;
            $scope.gridOptions.totalItems = res.TableCount[0];
            //deferred.resolve(data);
          },
          function (error) {
            deferred.reject(error);
          }
        );

      };

      var gridMenu = [
        {
          title: $translate.instant("Create"),
          action: function () {
            $scope.reset();
            $scope.status = "N";
            $("#myModal").modal("show");
          },
          order: 1
        },
        {
          title: $translate.instant("Update"),
          action: function () {
            var resultRows = $scope.gridApi.selection.getSelectedRows();
            $scope.recod.id = resultRows.BM;
            $scope.recod.ten = resultRows.TenBM;
            $scope.status = "M"; //Set update Status
            if (resultRows.length == 1) {
              if (resultRows[0].Status != "X") {
                if (resultRows[0].UserID == Auth.username) {

                  $("#myModal").modal("show");
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
          action: function () {
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

      $scope.deleteWasteItem = function (index) {
        $scope.wasteItems.splice(index, 1);
      };
      $scope.clear = function () {
        $scope.recod = {};

        $("#myModal").modal("hide");
      };


      //DIRECTIVE

      /**
       * Init Data to save
       */
      function saveInitData() {
        var note = {};
        note.CompID = $scope.recod.comp_id || '';
        note.CompName = $scope.recod.comp_name;
        return note;
      }
      /**
       * Update status by updateByID
       */
      function updateByID(data) {
        CompanyService.UpdateCompany(data, function (res) {
          if (res.Success) {
            $scope.Search();
            $('#myModal').modal('hide');
            $('#messageModal').modal('hide');
            $('#nextModal').modal('hide');
          } else {
            Notifications.addError({
              'status': 'error',
              'message': $translate.instant('saveError') + res.Message
            });
          }

        },
          function (error) {
            Notifications.addError({
              'status': 'error',
              'message': $translate.instant('saveError') + error
            });
          })
      }
      /**
       * Save Company
       */
      function SaveCompany(data) {
        CompanyService.CreateCompany(data, function (res) {
          console.log(res)
          if (res.Success) {
            $scope.Search();
            $('#myModal').modal('hide');
            $('#messageModal').modal('hide');
            $('#nextModal').modal('hide');
          }
          else {
            Notifications.addError({ 'status': 'error', 'message': $translate.instant('saveError') + res.Message });
          }

        }, function (error) {
          Notifications.addError({ 'status': 'error', 'message': $translate.instant('saveError') + error });
        })
      }
      /**
       *reset data function
       */
      $scope.reset = function () {
        $scope.recod = {};
        $('#myModal').modal('hide');
      }
      /**
       * save submit Company
       */
      $scope.saveSubmit = function () {
        var note = saveInitData();
        var status = $scope.status;
        switch (status) {
          case 'N':
            SaveCompany(note);
            break;
          case 'M':
            updateByID(note);
            break;
          default:
            SaveCompany(note);
            break;
        }

      };






    }
  ]);
});
