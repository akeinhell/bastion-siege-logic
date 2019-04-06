import {Buildings, Workshop} from '../buildings'
import {Resources} from '../resources'

import {EMOJI} from './emoji'
import {GamescreenContent} from './gamescreen-type'
import {GAMETEXT_CONSTRUCTIONS} from './gametext'
import {parsePlayer} from './player'

import * as contentFilter from './helpers/content-filter'
import * as regexHelper from './helpers/regex'

export function main(content: string): GamescreenContent {
	if (!contentFilter.includesAny(content, 'Сезон', 'Season')) {
		return {}
	}

	const firstLine = content.split('\n')[0].trim()

	return {
		type: 'main',
		player: parsePlayer(firstLine),
		resources: parseResources(content)
	}
}

export function buildings(content: string): GamescreenContent {
	if (!contentFilter.startsAny(content, 'Buildings', 'Постройки')) {
		return {}
	}

	const buildings: Buildings = {
		townhall: regexHelper.getNumberStrict(content, `${EMOJI.townhall}\\s+(\\d+)`),
		storage: regexHelper.getOptionalNumber(content, `${EMOJI.storage}\\s+(\\d+)`) || 0,
		houses: regexHelper.getNumberStrict(content, `${EMOJI.houses}\\s+(\\d+)`),
		farm: regexHelper.getOptionalNumber(content, `${EMOJI.farm}\\s+(\\d+)`) || 0,
		sawmill: regexHelper.getOptionalNumber(content, `${EMOJI.sawmill}\\s+(\\d+)`) || 0,
		mine: regexHelper.getOptionalNumber(content, `${EMOJI.mine}\\s+(\\d+)`) || 0,
		barracks: regexHelper.getOptionalNumber(content, `${EMOJI.barracks}\\s+(\\d+)`) || 0,
		wall: regexHelper.getOptionalNumber(content, `${EMOJI.wall}\\s+(\\d+)`) || 0
	}

	return {buildings}
}

export function workshop(content: string): GamescreenContent {
	if (contentFilter.starts(content, 'Workshop')) {
		const workshop: Workshop = {
			trebuchet: regexHelper.getOptionalNumber(content, `${EMOJI.trebuchet}${GAMETEXT_CONSTRUCTIONS.trebuchet.en}\\s+(\\d+)`) || 0,
			ballista: regexHelper.getOptionalNumber(content, `${EMOJI.ballista}${GAMETEXT_CONSTRUCTIONS.ballista.en}\\s+(\\d+)`) || 0
		}
		return {workshop}
	}

	if (contentFilter.starts(content, 'Мастерская')) {
		const workshop: Workshop = {
			trebuchet: regexHelper.getOptionalNumber(content, `${EMOJI.trebuchet}${GAMETEXT_CONSTRUCTIONS.trebuchet.ru}\\s+(\\d+)`) || 0,
			ballista: regexHelper.getOptionalNumber(content, `${EMOJI.ballista}${GAMETEXT_CONSTRUCTIONS.ballista.ru}\\s+(\\d+)`) || 0
		}
		return {workshop}
	}

	return {}
}

export function storage(content: string): GamescreenContent {
	if (!contentFilter.starts(content, EMOJI.storage)) {
		return {}
	}

	const resources: Resources = {
		gold: regexHelper.getNumberStrict(content, `(\\d+)${EMOJI.gold}\n`),
		wood: regexHelper.getNumberStrict(content, `(\\d+)/\\d+${EMOJI.wood}`),
		stone: regexHelper.getNumberStrict(content, `(\\d+)/\\d+${EMOJI.stone}`),
		food: regexHelper.getNumberStrict(content, `(\\d+)/\\d+${EMOJI.food}`)
	}

	return {
		type: 'storage',
		resources
	}
}

export function resources(content: string): GamescreenContent {
	if (contentFilter.startsAny(content, 'Ресурсы', 'Resources')) {
		return {
			type: 'resources',
			resources: parseResources(content)
		}
	}

	return {}
}

function parseResources(content: string): Resources {
	return {
		gold: regexHelper.getNumberStrict(content, `(\\d+)${EMOJI.gold}`),
		wood: regexHelper.getNumberStrict(content, `(\\d+)${EMOJI.wood}`),
		stone: regexHelper.getNumberStrict(content, `(\\d+)${EMOJI.stone}`),
		food: regexHelper.getNumberStrict(content, `(\\d+)${EMOJI.food}`)
	}
}
