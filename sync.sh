#!/bin/bash

source .env;
clear;

function help() {
	echo -e "\e[0;32mUsage\e[0m: ./sync.sh [options]"
	echo -e "\n\e[0;32mOptions\e[0m:"
	echo -e "  -h, --help\t\t\tDisplay this help message."
	echo -e "  -t, --type\t\t\tType of the repository."
	echo -e "  -c, --code\t\t\tCode of the repository."
	echo -e "  -p, --project\t\t\tIs it a project ?"
	echo -e "  -T, --team\t\t\tTeam of the repository."
	echo -e "\n\e[0;32mExamples\e[0m:"
	echo -e "  ./sync.sh"
	echo -e "  ./sync.sh -t WEB -c 500"
	echo -e "  ./sync.sh -t WEB -c 501 -p -T STG_11"
	echo -e "  ./sync.sh --type WEB --code 500 --project --team STG_11"
	echo -e "\n\e[0;32mNote\e[0m: If you don't specify an option, the program will ask you."
	echo -e "\n\e[0;32mNote\e[0m: You can use the interactive mode by running the program without any option."
	echo -e "  ./sync.sh"
	echo -e ""
}

function selected() {
	echo -e "\nSelected ${1}: \e[0;33m${2}\e[0m"
}

function chooseType() {
	if [ ${#type} -gt 0 ]; then
		selected "type" "${type}";
		return;
	fi
	echo -e "Type of the repository [\e[0;33mWEB\e[0m]"
	printf '> '
	read type
	if [ -z "${type}" ]; then
		type="WEB"
	fi
	type=$(echo $type | tr '[:lower:]' '[:upper:]')
}

function chooseCode() {
	if [ ${#code} -gt 0 ]; then
		selected "code" "${code}";
		return;
	fi
	echo -e "\nCode of the repository [\e[0;33m500\e[0m]"
	printf '> '
	read code
	if [ -z "${code}" ]; then
		code="500"
	fi
}

function isProject() {
	if [ ${#project} -gt 0 ]; then
		selected "project" "${project}";
		return;
	fi
	if [ "${5}" == "--project" ] || [ "${5}" == "-p" ]; then
		selected "project" "${6}"
		if [ "${6}" == "yes" ]; then
			project=1;
		else
			project=0;
		fi
		return;
	fi

	echo -e "\nIs it a project ? (yes/no) [\e[0;33mno\e[0m]"
	printf '> '
	read project
	if [ "${project}" == "yes" ]; then
		project=1;
	else
		project=0;
	fi
}

function chooseTeam() {
	if [ ${#team} -gt 0 ]; then
		selected "team" "${team}";
		return;
	fi
	defaultTeam="STG_${STUDENT_NAME}";
	echo -e "\nWhat's your team ? [\e[0;33m${defaultTeam}\e[0m]"
	printf '> '
	read team
	if [ -z "${team}" ]; then
		team="${defaultTeam}"
	fi
}

if [ "${1}" == "--help" ] || [ "${1}" == "-h" ]; then
	help;
	exit;
fi

while getopts ":t:c:pT:" opt; do
	case $opt in
		t)
			type="$OPTARG"
			;;
		c)
			code="$OPTARG"
			;;
		p)
			project=1
			;;
		T)
			team="$OPTARG"
			;;
		\?)
			echo "Invalid option: -$OPTARG" >&2
			exit 1
			;;
		:)
			echo "Option -$OPTARG requires an argument." >&2
			exit 1
			;;
	esac
done

chooseType;
chooseCode;
isProject;

if [ ${project} == 1 ]; then
	chooseTeam;
	ROOT="T-${type}-${code}-${team}"
else
	ROOT="T-${type}-${code}_${PROJECT_EXTENSION}"
fi

if ! [ -d "${ROOT}" ]; then
	mkdir $ROOT
	echo -e "\n\e[0;32mSuccess\e[0m: ${ROOT} created."
fi

cd $ROOT
hasCommit=false;

if [ ${project} == 1 ]; then
		repository="T-${type}-${code}-${team}";
		git clone "git@github.com:${PROMOTION_NAME}/${repository}.git" . > /dev/null 2>&1
		rm -rf .git
		if [ -f ".env.example" ]; then
			echo -e "\n.env.example file found, continue ? (yes/no) [\e[0;33mno\e[0m]"
			printf '> '
			read type
			if ! [ "${type}" == "yes" ]; then
				echo -e "\nPush aborted."
				exit;
			fi
		fi
		cd ..
		git add $repository > /dev/null 2>&1
		git commit -m "Push ${repository}." > /dev/null 2>&1
		hasCommit=true;
		echo -e "\n\e[0;32mSuccess\e[0m: ${repository} added.";
else
	echo -e "";
	for ((i=1; i<=10; i++))
	do
		if [ $i -lt 10 ]; then
			fday="0$i"
		else
			fday="$i"
		fi
		repository="T-${type}-${code}-day${fday}-STG_${STUDENT_NAME}"
		if [ -d "${repository}" ]; then
			echo -e "\e[0;31mError\e[0m: ${repository} already exists, skip."
		else
			git clone "git@github.com:EpitechMscProPromo2026/${repository}.git" > /dev/null 2>&1
			if [ $? -ne 0 ]; then
				echo -e "\e[0;31mError\e[0m: ${repository} doesn't exist on remote, skip.";
			else
				rm -rf $repository/.git $repository/*.pdf
				if [ "$(ls -A ${repository})" ]; then
					git add $repository > /dev/null 2>&1
					git commit -m "Push ${repository}." > /dev/null 2>&1
					hasCommit=true;
					echo -e "\e[0;32mSuccess\e[0m: ${repository} added.";
				else
					rm -rf $repository
					echo -e "\e[0;31mError\e[0m: ${repository} is empty, deleted.";
				fi
			fi
		fi
	done
fi

if [ ${hasCommit} == true ]; then
	make clean > /dev/null 2>&1
	git push > /dev/null 2>&1
	echo -e "\n\e[0;32mSuccess\e[0m: Pushed to remote.\n";
fi
