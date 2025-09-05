import * as inflection from 'inflection';

export const getSubstitutionsFromOptions = (options: Record<string, any>) => {
  const substitutions = { ...options };
  substitutions.lowerName =
    substitutions.lowerName ?? inflection.camelize(options.name, true);

  substitutions.lowerHyphenName =
    substitutions.lowerHyphenName ??
    inflection.dasherize(
      inflection.singularize(inflection.tableize(options.name))
    );

  substitutions.lowerHyphenPluralName = inflection.pluralize(
    substitutions.lowerHyphenName
  );

  substitutions.allUpperName =
    substitutions.allUpperName ??
    substitutions.lowerHyphenName.split('-').join(' ').toUpperCase();

  substitutions.pluralName = inflection.pluralize(options.name);

  substitutions.humanPluralName = inflection.titleize(
    inflection.tableize(options.name)
  );

  substitutions.humanUpperName = inflection.singularize(
    substitutions.humanPluralName
  );

  return substitutions;
};
