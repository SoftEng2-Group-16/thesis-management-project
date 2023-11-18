"use strict";

function ThesisProposal(id, title, supervisor, cosupervisors, keywords, type, groups, descritpion, requirements, notes, expiration, level, cds) {
    this.id = id;
    this.title = title;
    this.supervisor = supervisor;
    this.cosupervisors = cosupervisors;
    this.keywords = keywords;
    this.type = type;
    this.groups = groups;
    this.description = descritpion;
    this.requirements = requirements;
    this.notes = notes;
    this.expiration = expiration;
    this.level = level;
    this.cds = cds;   
}

function Application(id, thesisId,studentId,timestamp,status,teacherId){
    this.id = id;
    this.stduentId = studentId;
    this.thesisId=thesisId;
    this.timestamp = timestamp;
    this.status=status;
    this.teacherId=teacherId;

}
module.exports = {ThesisProposal,Application};