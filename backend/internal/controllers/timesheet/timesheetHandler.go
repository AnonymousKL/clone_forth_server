package timesheet

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"time"

	"http-server/internal/appctx"
	"http-server/internal/models"
	"http-server/internal/services/timesheet"

	"github.com/gin-gonic/gin"
	"github.com/xuri/excelize/v2"
	"gorm.io/datatypes"
)

type timesheetHandler struct {
	appCtx           *appctx.AppCtx
	timesheetService timesheet.ITimeSheet
}

func NewTimesheetHandler(appCtx *appctx.AppCtx) timesheetHandler {
	return timesheetHandler{
		appCtx:           appCtx,
		timesheetService: appCtx.GetTimesheetService(),
	}
}

func (th *timesheetHandler) GetAll(ctx *gin.Context) {
	var page = ctx.DefaultQuery("page", "1")
	var limit = ctx.DefaultQuery("limit", "20")
	intPage, _ := strconv.Atoi(page)
	intLimit, _ := strconv.Atoi(limit)
	offset := (intPage - 1) * intLimit
	from, _ := ctx.GetQuery("from")
	to, _ := ctx.GetQuery("to")
	projectIdString, _ := ctx.GetQuery("projectId")

	timeSheets := th.timesheetService.GetAll(from, to, projectIdString, offset, intLimit)
	ctx.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   timeSheets,
	})
}

func (th *timesheetHandler) GetByMemberId(ctx *gin.Context) {
	id := ctx.Param("id")
	idInt, _ := strconv.Atoi(id)
	th.timesheetService.GetByMemberId(idInt, ctx)
}

func (th *timesheetHandler) Create(ctx *gin.Context) {
	var payload *models.CreateTimeSheetRequest
	if err := ctx.ShouldBindJSON(&payload); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	timesheet := models.TimeSheet{
		MemberID:  payload.MemberID,
		ProjectID: payload.ProjectID,
		DayLog:    payload.DayLog,
	}

	if err := th.timesheetService.Create(timesheet); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"data": payload})
}

func (th *timesheetHandler) Delete(ctx *gin.Context) {
	id := ctx.Param("id")
	idInt, _ := strconv.Atoi(id)
	if err := th.timesheetService.Delete(idInt); err != nil {
		ctx.JSON(http.StatusBadGateway, gin.H{
			"status":  "error",
			"message": err.Error(),
		})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Delete timesheet successful",
	})
}

func (th *timesheetHandler) SaveSegment(ctx *gin.Context) {
	timesheetId := ctx.Param("id")
	timesheetIdInt, _ := strconv.Atoi(timesheetId)
	var tsSegmentsPayload []models.CreateTimesheetSegment
	if err := ctx.ShouldBindJSON(&tsSegmentsPayload); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var segmentModels []models.TimeSheetSegment
	for _, segment := range tsSegmentsPayload {
		segmentModels = append(segmentModels, models.TimeSheetSegment{
			TimeSheetID: uint(timesheetIdInt),
			Hours:       segment.Hours,
			Date:        segment.Date,
		})
	}
	th.timesheetService.SaveSegment(timesheetIdInt, segmentModels)
}

func (th *timesheetHandler) SaveMultipleTsSegment(ctx *gin.Context) {
	var tsSegmentsPayload []models.MultipleTsSegmentRequest

	if err := ctx.ShouldBindJSON(&tsSegmentsPayload); err != nil {
		ctx.JSON(http.StatusBadGateway, gin.H{
			"status":  "error",
			"message": err.Error(),
		})
		return
	}

	// TODO: Handle error on save
	errFlag := false // not work
	for _, segment := range tsSegmentsPayload {
		var segmentModels []models.TimeSheetSegment
		for _, segmentNode := range segment.Segments {
			segmentModels = append(segmentModels, models.TimeSheetSegment{
				TimeSheetID: uint(segment.TimesheetId),
				Hours:       segmentNode.Hours,
				Date:        segmentNode.Date,
			})
		}
		err := th.timesheetService.SaveSegment(segment.TimesheetId, segmentModels)
		if err != nil {
			errFlag = true
			ctx.JSON(http.StatusBadGateway, gin.H{
				"status":  "error",
				"message": err.Error(),
			})
		}
	}
	if errFlag == false {
		ctx.JSON(http.StatusCreated, gin.H{
			"status":  "success",
			"message": "Timesheet created successful",
		})
	}
}

func (th *timesheetHandler) GetById(ctx *gin.Context) {
	timesheetId, _ := strconv.Atoi(ctx.Param("id"))
	timesheet, _ := th.timesheetService.GetById(timesheetId)
	ctx.JSON(http.StatusOK, gin.H{"data": timesheet})
}

func (th *timesheetHandler) GetByProjectId(ctx *gin.Context) {
	projectId, err := strconv.Atoi(ctx.Param("id"))
	from, _ := ctx.GetQuery("from")
	to, _ := ctx.GetQuery("to")
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"message": "Cannot parse project id",
		})
		return
	}

	timeSheets, err := th.timesheetService.GetByProjectId(projectId, from, to)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"message": "Cannot get timesheet",
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   timeSheets,
	})
}

func (th *timesheetHandler) ExportExcel(ctx *gin.Context) {
	from, _ := ctx.GetQuery("from")
	to, _ := ctx.GetQuery("to")
	timeSheets := th.timesheetService.GetAll(from, to, "", -1, -1)
	curTime := time.Now()

	f := excelize.NewFile()
	defer func() {
		if err := f.Close(); err != nil {
			fmt.Println(err)
		}
	}()

	_, err := f.NewSheet("Sheet1")
	if err != nil {
		fmt.Println(err)
		return
	}

	f.SetCellValue("Sheet1", "A1", "Project")
	f.SetCellValue("Sheet1", "B1", "Member")
	f.SetCellValue("Sheet1", "C1", "StartDate")
	f.SetCellValue("Sheet1", "D1", fmt.Sprintf("%d/%d/%d", curTime.Year(), curTime.Month(), curTime.Day()))

	style, _ := f.NewStyle(&excelize.Style{
		Font: &excelize.Font{Bold: true},
		Alignment: &excelize.Alignment{
			Horizontal: "center",
			Vertical:   "center",
		},
	})
	f.SetRowStyle("Sheet1", 1, 1, style)

	for i, timeSheet := range timeSheets {
		startDateBytes, _ := datatypes.Date(timeSheet.DayLog.Date).MarshalJSON()
		f.SetCellValue("Sheet1", fmt.Sprintf("A%d", i+2), timeSheet.Project.Name)
		f.SetCellValue("Sheet1", fmt.Sprintf("B%d", i+2), timeSheet.Member.Name)
		f.SetCellValue("Sheet1", fmt.Sprintf("C%d", i+2), string(startDateBytes))
		f.SetCellValue("Sheet1", fmt.Sprintf("D%d", i+2), i)
	}

	// Create storage dir if not exist
	if _, err := os.Stat("storage"); err != nil {
		err := os.Mkdir("storage", os.ModePerm)
		if err != nil {
			log.Println(err.Error())
		}
	}

	todayDateString := fmt.Sprintf("%d-%d-%d", curTime.Year(), curTime.Month(), curTime.Day())
	fileName := fmt.Sprintf("Timesheet%s.xlsx", todayDateString)
	savePath := fmt.Sprintf("storage/Timesheet%s.xlsx", todayDateString)
	if err := f.SaveAs(savePath); err != nil {
		log.Println("Save Err: ", err)
	}

	path, err := filepath.Abs(savePath)
	if err != nil {
		log.Println("Get filepath error: ", err)
	}
	ctx.FileAttachment(path, fileName)
}
