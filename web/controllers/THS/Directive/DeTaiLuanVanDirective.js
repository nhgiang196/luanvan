define(["myapp", "angular"], function (myapp, angular) {
  myapp.directive("createLuanVan", [
    "DeTaiLuanVanService",
    "Auth",
    "$q",
    function (DeTaiLuanVanService, Auth, $q) {
      return {
        restrict: "E",
        controller: function ($scope) {
          $scope.flowkey = "MLV";
          $scope.username = Auth.username;
          formVariables = $scope.formVariables = [];
          historyVariable = $scope.historyVariable = [];

          /**
           * Init Data to save
           */
          function saveInitData() {
            var note = {};
            note.lv = $scope.recod.lv || "";
            return note;
          }
          /**
           * Update status by updateByID
           */
          function updateByID(data) {
            VoucherService.UpdateVoucher(
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
           * Save Voucher
           */
          function SaveVoucher(data) {
            VoucherService.CreateVoucher(
              data,
              function (res) {
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
              function (error) {
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
          $scope.reset = function () {
            $scope.recod = {};
            $scope.wasteItems = [];
            $("#myModal").modal("hide");
            $scope.Search();
          };
          /**
           * save submit Voucher
           */
          $scope.saveSubmit = function () {
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
