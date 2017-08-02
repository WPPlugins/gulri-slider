function gsp_replaceSubstring(inSource, inToReplace, inReplaceWith)
{
	return inSource.replace(new RegExp(inToReplace, 'g'),inReplaceWith);
}
