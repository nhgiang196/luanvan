define(["myapp", "angular"], function(myapp, angular) {
    myapp.directive("createLuanVan", [
      "DeTaiLuanVanService",
      "Auth",
      "$q",
      function(DeTaiLuanVanService, Auth, $q) {
        return {
          restrict: "E",
          controller: function($scope) {
            $scope.flowkey = "MLV";
            $scope.username = Auth.username;
            formVariables = $scope.formVariables = [];
            historyVariable = $scope.historyVariable = [];
  
            /**
             * Init Data to save
             */
            function saveInitData() {
              var note = {};
              note.VoucherID = $scope.recod.voucher_id || "";
              note.OWnerComp = $scope.recod.owner_comp || "";
              note.ProcessComp = $scope.recod.process_comp || "";
              note.VoucherNumber = $scope.recod.voucher_number || "";
              note.DepartReq = $scope.recod.depart_req || "";
              note.DepartProcess = $scope.recod.depart_process || "";
              note.InternalPhone = $scope.recod.internal_phone || "";
              note.Location = $scope.recod.location || "";
              note.DateOut = $scope.recod.date_out || "";
              note.DateComplete = $scope.recod.date_complete || "";
              note.ReturnReason = "";
              note.CreateTime = $scope.recod.create_time;
              note.UserID = Auth.username;
              note.Stamp = Date.now();
              note.Status = $scope.status;
              note.VoucherDetails = $scope.wasteItems;
  
              return note;
            }
            /**
             * Update status by updateByID
             */
            function updateByID(data) {
              VoucherService.UpdateVoucher(
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
             * Save Voucher
             */
            function SaveVoucher(data) {
              VoucherService.CreateVoucher(
                data,
                function(res) {
                  console.log(res);
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
             *reset data function
             */
            $scope.reset = function() {
              $scope.recod = {};
              $scope.wasteItems = [];
              $("#myModal").modal("hide");
              $scope.Search();
            };
            /**
             * save submit Voucher
             */
            $scope.saveSubmit = function() {
              var note = saveInitData();
              var status = $scope.status;
              switch (status) {
                case "N":
                  SaveVoucher(note);
                  break;
                case "M":
                  updateByID(note);
                  break;
                default:
                  SaveVoucher(note);
                  break;
              }
            };
          },
          templateUrl: "./forms/EHS/Voucher/createVoucher.html"
        };
      }
    ]);
  });
  