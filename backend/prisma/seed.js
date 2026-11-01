import { PrismaClient } from '@prisma/client';
import { VERIFIED_SCHEMES } from '../src/data/verifiedSchemes.js';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding verified government schemes into PostgreSQL...');

  for (const schemeData of VERIFIED_SCHEMES) {
    const { criteria, ...schemeBase } = schemeData;

    const scheme = await prisma.scheme.upsert({
      where: { code: schemeBase.code },
      update: {
        ...schemeBase,
      },
      create: {
        ...schemeBase,
      },
    });

    console.log(`- Upserted scheme: ${scheme.code} (${scheme.titleEn})`);

    // Clean old criteria and recreate
    await prisma.schemeCriterion.deleteMany({
      where: { schemeId: scheme.id },
    });

    if (criteria && criteria.length > 0) {
      await prisma.schemeCriterion.createMany({
        data: criteria.map((c) => ({
          schemeId: scheme.id,
          field: c.field,
          operator: c.operator,
          value: c.value,
          labelEn: c.labelEn,
          labelHi: c.labelHi,
          isMandatory: c.isMandatory ?? true,
        })),
      });
    }

    // Upsert official source
    await prisma.schemeSource.deleteMany({
      where: { schemeId: scheme.id },
    });
    await prisma.schemeSource.create({
      data: {
        schemeId: scheme.id,
        title: `${scheme.titleEn} Official Portal`,
        url: scheme.sourceUrl,
        sourceType: 'GOVERNMENT_PORTAL',
        verifiedDate: scheme.verifiedAt,
      },
    });
  }

  console.log('Database seeding complete with verified Government of India records.');
}

main()
  .catch((e) => {
    console.error('Error during database seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
