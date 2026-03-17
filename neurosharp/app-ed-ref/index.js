  const router = useRouter();
  const [location] = useLocationFromRouter(router);

  const [matches, routeParams, base] =
    // `match` is a special prop to give up control to the parent,
    // it is used by the `Switch` to avoid double matching
    match ?? matchRoute(router.parser, path, location, nest);

  // when `routeParams` is `null` (there was no match), the argument
  // below becomes {...null} = {}, see the Object Spread specs
  // https://tc39.es/proposal-object-rest-spread/#AbstractOperations-CopyDataProperties
  const params = useCachedParams({ ...useParams(), ...routeParams });

  if (!matches) return null;

  const children = base
    ? createElement(Router, { base }, h_route(renderProps, params))
    : h_route(renderProps, params);

  return createElement(ParamsCtx.Provider, { value: params, children });
};

const Link = forwardRef((props, ref) => {
  const router = useRouter();
  const [currentPath, navigate] = useLocationFromRouter(router);

  const {
    to = "",
    href: targetPath = to,
    onClick: _onClick,