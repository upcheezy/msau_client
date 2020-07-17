with unnesting as (
	select unnest (mc.codes) as codes
	from msau_creds mc 
	where mc.username = 'mupchurch'
		and mc."password" = 'P@sswor>'
)

select un.codes, st_union(sa.geom)
from unnesting un
join serviceareas sa
	on un.codes = sa.dccode
group by un.codes