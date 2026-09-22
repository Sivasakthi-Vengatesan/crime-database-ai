@REM ----------------------------------------------------------------------------
@REM Maven Wrapper Script for Crime Database AI Backend
@REM ----------------------------------------------------------------------------
@echo off
setlocal

set "DIR=%~dp0"
if exist "%DIR%tools\apache-maven-3.9.9\bin\mvn.cmd" (
    "%DIR%tools\apache-maven-3.9.9\bin\mvn.cmd" %*
) else (
    mvn %*
)

endlocal
