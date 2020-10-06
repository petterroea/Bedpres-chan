import { IBedpres, Bedpres } from './models/bedpres'

import { sendEventFoundMessage, sendEventChangedMessage, sendRegistrationReminder } from './discord'

const diffEvent = async (newBedpres: IBedpres, old: IBedpres) => {
	const differing = [];

	if(newBedpres.title != old.title) {
		differing.push(`title used to be \n\`${old.title}\`, is now \`${newBedpres.title}\``)
	}

	if(newBedpres.description != old.description) {
		differing.push(`description used to be \n\`${old.description}\`, \nis now \`${newBedpres.description}\``)
	}

	if(newBedpres.ingress != old.ingress) {
		differing.push(`ingress used to be \n\`${old.ingress}\`, \nis now \`${newBedpres.ingress}\``)
	}

	if(newBedpres.ingress_short != old.ingress_short) {
		differing.push(`ingress_short used to be \n\`${old.ingress_short}\`, \nis now \`${newBedpres.ingress_short}\``)
	}

	if(newBedpres.event_start.getTime() != old.event_start.getTime()) {
		differing.push(`event_start used to be \n\`${old.event_start}\`, \nis now \`${newBedpres.event_start}\``)
	}

	if(newBedpres.registration_start?.getTime() != old.registration_start?.getTime()) {
		differing.push(`event_reg_start used to be \n\`${old.registration_start}\`, \nis now \`${newBedpres.registration_start}\``)
	}

	return differing
}


export const processBedpresList = async (list: IBedpres[]) => {
    for(let event of list) {
        console.log(event.title)        
        console.log(`${event.event_start.getTime()} should be > ${new Date().getTime()}(now)`)

        //We don't care about events that are in the past
        if(event.event_start.getTime() > new Date().getTime()) {
            console.log("this bedpres is up and coming")
            let bedpres: IBedpres|null = await Bedpres.findOne({
                id: event.id,
                source: event.source
            })

            if(bedpres === null) {
                console.log("Never before seen bedpres!")
                await sendEventFoundMessage(event)
                bedpres = event
                await bedpres.save()
            } else {
                console.log("Known bedpres!")
                const differentFields = await diffEvent(event, bedpres);

                if(differentFields.length > 0) {
                    await sendEventChangedMessage(event, differentFields);

                    //Just update everything #yolo
                    (bedpres as any).title = event.title;
                    (bedpres as any).description = event.description;
                    (bedpres as any).ingress = event.ingress;
                    (bedpres as any).ingress_short = event.ingress_short;
                    (bedpres as any).event_start = event.event_start;
                    (bedpres as any).registrationReminderSent = false;
                    (bedpres as any).registration_start = event.registration_start
                    
                    await bedpres.save()
                }
            }

            if(bedpres.registration_start !== null) {
                //If the registration is today, send a message
                const nowDay = new Date().toLocaleDateString();
                const attendanceDate = bedpres.registration_start.toLocaleDateString();
                console.log(`Attendance: ${nowDay} vs ${attendanceDate}`)
                if(nowDay == attendanceDate) {
                    console.log("The attendance event is today! Sending reminder")
                    console.log(`Old reminded list: ${bedpres.remindedServers}`)
                    const remindedList = await sendRegistrationReminder(bedpres, bedpres.remindedServers);
                    console.log(`New reminded list: ${remindedList}`)
                    bedpres.remindedServers = remindedList;
                    await bedpres.save()
                }
            }
        }
    }
}