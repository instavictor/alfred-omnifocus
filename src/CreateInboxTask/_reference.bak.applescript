on run argv
	set str to item 1 of argv
	set taskName to trimT(extractName(str))
	
	tell application "OmniFocus"
		set oDoc to front document
		if str contains "::" then
			set projectName to my trimT(my extractTag("::", str))
			set xs to name of every flattened project of oDoc whose (name starts with projectName) and (completed is false)
			if xs = {} then
				set xs to {""}
			end if
			set apply to |λ|(str) of my curry(my createProjectRecord)
			set ys to my map(apply, xs)
		else if str contains "@" then
			set contextName to my trimT(my extractTag("@", str))
			set xs to name of every flattened tag of oDoc whose (name starts with contextName)
			if xs = {} then
				set xs to {""}
			end if
			set apply to |λ|(str) of my curry(my createContextRecord)
			set ys to my map(apply, xs)
		else
			set xs to name of every flattened project of oDoc whose (completed is false)
			set beginning of xs to "Inbox"
			if xs = {} then
				set xs to {""}
			end if
			set apply to |λ|(str) of my curry(my createInboxRecord)
			set ys to my map(apply, xs)
		end if
	end tell
	set jsonObjects to intercalate(", ", map(createObject, ys))
	return "{\"items\": [" & jsonObjects & "]}"
end run

on trimT(str)
	if (count (words of str)) = 0 then
		""
	else
		intercalate(" ", words 1 thru -1 of str)
	end if
end trimT

on extractName(str)
	set xs to splitOn({"!", "::", "@", "#", "//"}, str)
	return item 1 of xs
end extractName

on extractTag(s, str)
	if str contains s then
		set xs to splitOn(s, str)
		set x to item 2 of xs
		set xs to splitOn({"!", "::", "@", "#", "//"}, x)
		if xs ≠ {} then
			return item 1 of xs
		else
			""
		end if
	else
		""
	end if
end extractTag

on q(str)
	quote & str & quote
end q

on createInboxRecord(str, projectName)
	set taskName to trimT(extractName(str))
	set projString to " ::" & projectName
	if projectName = "Inbox" then
		set projString to ""
	end if
	{title:"Create task with project " & projectName, subtitle:taskName & " ::" & projectName, autocomplete:taskName & projString, arg:str & projString}
end createInboxRecord

on createProjectRecord(str, projectName)
	set taskName to trimT(extractName(str))
	{title:"Create task with project " & projectName, subtitle:taskName & " ::" & projectName, autocomplete:taskName & " ::" & projectName, arg:str}
end createProjectRecord

on createContextRecord(str, contextName)
	set taskName to trimT(extractName(str))
	{title:"Create task with context @" & contextName, subtitle:taskName & " @" & contextName, autocomplete:taskName & " @" & contextName, arg:str}
end createContextRecord

on createObject(rec)
	"{\"title\" : " & q(title of rec) & ", \"subtitle\" : " & q(subtitle of rec) & ", \"autocomplete\" : " & q(autocomplete of rec) & ", \"arg\" : " & q(arg of rec) & "}"
end createObject

-- GENERIC FUNCTIONS ---------------------------------------------------------

-- map :: (a -> b) -> [a] -> [b]
on map(f, xs)
	tell mReturn(f)
		set lng to length of xs
		set lst to {}
		repeat with i from 1 to lng
			set end of lst to |λ|(item i of xs, i, xs)
		end repeat
		return lst
	end tell
end map

-- Lift 2nd class handler function into 1st class script wrapper 
-- mReturn :: Handler -> Script
on mReturn(f)
	if class of f is script then
		f
	else
		script
			property |λ| : f
		end script
	end if
end mReturn

-- intercalate :: String -> [String] -> String
on intercalate(s, xs)
	set {dlm, my text item delimiters} to {my text item delimiters, s}
	set str to xs as text
	set my text item delimiters to dlm
	return str
end intercalate

-- splitOn :: Text -> Text -> [Text]
on splitOn(strDelim, strMain)
	set {dlm, my text item delimiters} to {my text item delimiters, strDelim}
	set xs to text items of strMain
	set my text item delimiters to dlm
	return xs
end splitOn

-- curry :: (Script|Handler) -> Script
on curry(f)
	script
		on |λ|(a)
			script
				on |λ|(b)
					|λ|(a, b) of mReturn(f)
				end |λ|
			end script
		end |λ|
	end script
end curry