package models

import (
	"time"

	"gorm.io/gorm"
)

// TODO
type Priority struct {
}

type Health struct {
	Health       string `json:"Health"`
	HealthReason string `json:"HealthReason"`
}

type Project struct {
	gorm.Model
	Name           string `gorm:"type:varchar(255);not null"`
	Description    string `gorm:"type:varchar(255)"`
	StatusID       uint   `gorm:"default:0"`
	Priority       string
	Health         Health    `gorm:"embedded"`
	Members        []*Member `gorm:"many2many:member_projects;"`
	ClientName     string    `gorm:"type:varchar(255);"`
	Budget         float32   `gorm:"type:decimal(20,3);"`
	ActualReceived float32   `gorm:"type:decimal(20,3);"`
	ActualCost     float32   `gorm:"type:decimal(20,3);"`
	StartDate      time.Time `gorm:"default:NULL"`
	EndDate        time.Time `gorm:"default:NULL"`
}

type CreateProjectRequest struct {
	Name           string `json:"Name" binding:"required"`
	Description    string `json:"Description"`
	StatusID       uint   `json:"StatusID,omitempty"`
	Priority       string `json:"Priority,omitempty"`
	Members        []uint `json:"Members,omitempty"`
	Health         Health
	ClientName     string    `json:"ClientName"`
	Budget         float32   `json:"Budget"`
	ActualReceived float32   `json:"ActualReceived"`
	StartDate      time.Time `json:"StartDate"`
	EndDate        time.Time `json:"EndDate"`
}

type ProjectResponse struct {
	ID             uint
	Name           string
	Description    string
	StatusID       uint
	Priority       string
	Health         Health
	Members        []*Member
	ClientName     string
	Budget         float32
	ActualCost     float32
	ActualReceived float32
	StartDate      time.Time
	EndDate        time.Time
}

type ProjectListResponse struct {
	Name string
	ID   uint
}
