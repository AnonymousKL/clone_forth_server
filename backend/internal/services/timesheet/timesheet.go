package timesheet

import (
	"fmt"
	"net/http"
	"strconv"
	"time"

	"http-server/internal/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type ITimeSheet interface {
	GetAll(from string, to string, projectId string, offset int, limit int) []models.TimeSheet
	Create(models.TimeSheet) error
	Update()
	Delete(id int) error
	SaveSegment(int, []models.TimeSheetSegment) error
	SaveMultipleTsSegment([]models.MultipleTsSegmentRequest)
	GetById(id int) (models.TimeSheet, error)
	GetByMemberId(memberId int, ctx *gin.Context)
	GetByProjectId(projectId int, from string, to string) ([]models.TimeSheet, error)
}

type TimeSheet struct {
	DB *gorm.DB
}

type TimeSheetResponse struct {
	ProjectName string    `json:"project_id"`
	MemberName  string    `json:"member_id"`
	Date        time.Time `json:"date"`
	TrackTime   int       `json:"track_time"`
}

type FormatTimeSheet struct {
	ProjectName string
	MemberName  string
	Logs        []models.DayLog
}

func NewTimeSheetService(db *gorm.DB) ITimeSheet {
	return &TimeSheet{
		DB: db,
	}
}

func (ts *TimeSheet) GetAll(from string, to string, projectIdString string, offset int, limit int) []models.TimeSheet {
	timeSheets := []models.TimeSheet{}
	now := time.Now()
	toDate := fmt.Sprintf("%d-%d-%d", now.Year(), now.Month(), now.Day())

	query := ts.DB.Limit(limit).Offset(offset).Preload("Member").Preload("Project")
	if from != "" {
		if to != "" {
			toDate = to
		}
		query.Preload("TimeSheetSegment", "date >= ? AND date <= ?", from, toDate)
	} else {
		query.Preload("TimeSheetSegment")
	}
	if projectIdString != "" {
		projectId, _ := strconv.Atoi(projectIdString)
		query.Where("project_id = ?", uint(projectId))
	}
	query.Find(&timeSheets)

	if query.Error != nil {
		fmt.Println("Error on get all timesheet")
	}
	return timeSheets
}

func (ts *TimeSheet) Create(timeSheet models.TimeSheet) error {
	result := ts.DB.Create(&timeSheet)
	if result.Error != nil {
		fmt.Println("Error on create timesheet")
		return result.Error
	}
	return nil
}

func (ts *TimeSheet) Update() {}

func (ts *TimeSheet) Delete(id int) error {
	err := ts.DB.Delete(&models.TimeSheet{}, id).Error
	return err
}

func (ts *TimeSheet) SaveSegment(timesheetId int, timesheetSegments []models.TimeSheetSegment) error {
	_, err := ts.GetById(timesheetId)
	if err != nil {
		fmt.Println("Cannot get timesheet by id")
		return err
	}

	tsErr := ts.DB.Create(&timesheetSegments)
	if tsErr.Error != nil {
		fmt.Printf("Error create segment: %s", tsErr.Error.Error())
		return err
	}
	return nil
}

func (ts *TimeSheet) SaveMultipleTsSegment(tsSegments []models.MultipleTsSegmentRequest) {}

func (ts *TimeSheet) GetById(id int) (models.TimeSheet, error) {
	timesheet := models.TimeSheet{}
	result := ts.DB.Where("id = ?", uint(id)).Preload("Member").Preload("Project").Preload("TimeSheetSegment").Find(&timesheet)
	return timesheet, result.Error
}

func (ts *TimeSheet) GetByMemberId(userId int, ctx *gin.Context) {
	from := ctx.Query("from")
	// timeSheets := []models.TimeSheet{}
	timeSheets := []map[string]interface{}{}
	result := ts.DB.Raw("SELECT members.name as MemberName, projects.name as ProjectName, time_sheets.date, time_sheets.track_time FROM time_sheets INNER JOIN members ON time_sheets.member_id = members.id INNER JOIN projects ON time_sheets.project_id = projects.id WHERE member_id = ? AND time_sheets.date >= ?", userId, from).Find(&timeSheets)

	if result.Error != nil {
		fmt.Println("Cannot get timesheet")
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"data": timeSheets,
	})
}

func (ts *TimeSheet) GetByProjectId(projectId int, from string, to string) ([]models.TimeSheet, error) {
	timeSheets := []models.TimeSheet{}
	now := time.Now()
	toDate := fmt.Sprintf("%d-%d-%d", now.Year(), now.Month(), now.Day())

	query := ts.DB.Preload("Member").Preload("Project")
	if to != "" {
		toDate = to
	}
	if from != "" {
		query.Preload("TimeSheetSegment", "date >= ? AND date <= ?", from, toDate)
	}
	query.Where("project_id = ?", projectId).Find(&timeSheets)

	if query.Error != nil {
		fmt.Println("Cannot get timesheet by project id")
		return nil, query.Error
	}
	return timeSheets, nil
}
